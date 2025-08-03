import { Router } from 'express';
import { Expense, ExpenseType, Fund } from '@prisma/client';
import { Request, Response } from 'express';
import dayjs from 'dayjs';
import csv from 'csv-parser';
import { Readable } from 'stream';
import multer from 'multer';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import prisma from '../utils/prisma';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

dayjs.extend(customParseFormat);

// Funds

router.get('/funds', async (req: Request, res: Response) => {
  const { type } = req.query;
  const searchText = (req.query.searchText as string) ?? "";

  const funds = await prisma.fund.findMany({
    where: {
      userId: req.user.id,
      type: type === 'all' ? undefined : type as ExpenseType,
      source: { contains: searchText, mode: 'insensitive' }
    },
    orderBy: { date: 'desc' },
  });
  res.json(funds);
});

router.post('/funds', async (req: Request, res: Response) => {
  const { date, source, amount, type } = req.body;
  const newFund = await prisma.fund.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(date),
      source,
      amount,
      type
    }
  });
  res.json(newFund);
});

router.post('/funds/:id', async (req: Request, res: Response) => {
  const fundId = Number(req.params.id);
  const { date, source, amount, type } = req.body;
  const updatedFund = await prisma.fund.update({
    where: { id: fundId },
    data: {
      date: new Date(date),
      source,
      amount,
      type
    }
  });
  res.json(updatedFund);
});

router.delete('/funds/:id', async (req: Request, res: Response) => {
  const fundId = Number(req.params.id);
  await prisma.fund.delete({ where: { id: fundId } });
  res.json({ message: 'Fund deleted successfully' });
});

// Categories

router.get('/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.expensesCategory.findMany({
    where: { userId: _req.user.id },
    orderBy: { name: 'asc' },
  });
  const categoriesWithSortedKeywords = categories.map(c => ({ ...c, keywords: c.keywords.sort() }))
  res.json(categoriesWithSortedKeywords);
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name, color, keywords } = req.body;
  const newCategory = await prisma.expensesCategory.create({
    data: {
      user: { connect: { id: req.user.id } },
      name,
      color,
      keywords
    }
  });
  res.json(newCategory);
});

router.post('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  const { name, color, keywords } = req.body;
  const updatedCategory = await prisma.expensesCategory.update({
    where: { id: categoryId },
    data: {
      name,
      color,
      keywords
    }
  });
  res.json(updatedCategory);
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);

  await prisma.expensesCategory.delete({ where: { id: categoryId } });
  res.json({ message: 'Category deleted successfully' });
});

// Statistics

router.get('/monthly', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string ?? '').trim();

  const monthlyExpenses: {
    [month: string]: {
      [category: string]: number;
      total: number;
    };
  } = {};

  const categoryNames = (await prisma.expensesCategory.findMany({
    where: { userId: req.user.id },
    orderBy: { name: 'asc' },
    select: { name: true },
  })).map(c => c.name);

  const expenses = await prisma.expense.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'desc' },
    include: { category: true },
  });

  expenses.forEach(expense => {
    const dayjsDate = dayjs(expense.date);
    if (!dayjsDate.format("MMMM YYYY").toLowerCase().includes(searchText.toLowerCase()))
      return;

    const monthStr = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyExpenses[monthStr]) {
      monthlyExpenses[monthStr] = { total: 0 };
      for (const category of categoryNames) {
        monthlyExpenses[monthStr][category] = 0;
      }
    }

    if (expense.category)
      monthlyExpenses[monthStr][expense.category.name] += expense.amount;

    monthlyExpenses[monthStr].total += expense.amount;
  });

  res.json(monthlyExpenses);
});

router.get('/statistics', async (req: Request, res: Response) => {
  const statistics: {
    monthlyAverageExpenses: number;
    totalExpenses: number;
    totalExpensesThisMonth: number;
    totalFunds: number;
    categories: {
      [category: string]: {
        monthlyAverage: number;
        total: number;
      };
    }
    months: {
      [month: string]: {
        expenses: number;
        funds: number;
      }
    }
  } = {
    monthlyAverageExpenses: 0,
    totalExpenses: 0,
    totalExpensesThisMonth: 0,
    totalFunds: 0,
    categories: {},
    months: {}
  };

  const expenses = await prisma.expense.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'asc' },
    include: { category: true },
  });

  const funds = await prisma.fund.findMany({
    where: { userId: req.user.id },
    orderBy: { date: 'asc' },
  });

  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  for (var { date, category, amount } of expenses) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!category)
      continue;

    if (!statistics.categories[category.name]) {
      statistics.categories[category.name] = { monthlyAverage: 0, total: 0 };
    }

    if (!statistics.months[month]) {
      statistics.months[month] = { expenses: 0, funds: 0 };
    }

    statistics.categories[category.name].total += amount;
    statistics.months[month].expenses += amount;
    statistics.totalExpenses += amount;

    if (month === thisMonth) {
      statistics.totalExpensesThisMonth += amount;
    }
  }

  for (const { date, amount } of funds) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!statistics.months[month]) {
      statistics.months[month] = { expenses: 0, funds: 0 };
    }

    statistics.months[month].funds += amount;
    statistics.totalFunds += amount;
  }

  const numMonths = Object.keys(statistics.months).length;
  for (const category in statistics.categories) {
    statistics.categories[category].monthlyAverage = statistics.categories[category].total / numMonths;
    statistics.monthlyAverageExpenses += statistics.categories[category].monthlyAverage;
  }

  res.json(statistics);
})

// Automated Expenses

const csvKeys = {
  date: "Date",
  bookingText: "Booking text",
  curr: "Curr",
  amountDetails: "Amount details",
  zkbReference: "ZKB reference",
  referenceNumber: "Reference number",
  debitCHF: "Debit CHF",
  creditCHF: "Credit CHF",
  valueDate: "Value date",
  balanceCHF: "Balance CHF",
  paymentPurpose: "Payment purpose",
  details: "Details"
}

type AutoEntry = {
  date: Date;
  bookingText: string;
  curr: string;
  amountDetails: string;
  zkbReference: string;
  referenceNumber: string;
  debitCHF: number;
  creditCHF: number;
  valueDate: Date;
  balanceCHF: number;
  paymentPurpose: string;
  details: string;
}

type FundWithoutId = Omit<Fund, 'id'>;
type ExpenseWithoutId = Omit<Expense, 'id'>;


router.post("/auto", upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).send('No file uploaded.');

  const expensesCategories = await prisma.expensesCategory.findMany({
    where: { userId: req.user.id },
    select: { id: true, keywords: true },
  });

  const fundKeywords = (await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { fundKeywords: true }
  }))?.fundKeywords || [];

  const results: AutoEntry[] = [];
  const stream = Readable.from(req.file.buffer);

  stream
    .pipe(csv({
      separator: ";",
      mapHeaders: ({ header }) => header.includes("Date") ? "Date" : header
    }))
    .on('data', (data) => {
      results.push({
        date: dayjs(data[csvKeys.date], 'DD.MM.YYYY').toDate(),
        bookingText: data[csvKeys.bookingText],
        curr: data[csvKeys.curr],
        amountDetails: data[csvKeys.amountDetails],
        zkbReference: data[csvKeys.zkbReference],
        referenceNumber: data[csvKeys.referenceNumber],
        debitCHF: parseFloat(data[csvKeys.debitCHF]),
        creditCHF: parseFloat(data[csvKeys.creditCHF]),
        valueDate: dayjs(data[csvKeys.valueDate], 'DD.MM.YYYY').toDate(),
        balanceCHF: parseFloat(data[csvKeys.balanceCHF]),
        paymentPurpose: data[csvKeys.paymentPurpose],
        details: data[csvKeys.details]
      });
    })
    .on('end', async () => {
      const funds: FundWithoutId[] = [];
      const expenses: ExpenseWithoutId[] = [];

      results.forEach(entry => {
        const hasAmount = entry.debitCHF || entry.creditCHF;
        const isFund = fundKeywords.some(keyword =>
          entry.bookingText.toLowerCase().includes(keyword.toLowerCase())
        );

        if (isFund && hasAmount) {
          const amount = entry.creditCHF || -entry.debitCHF;
          funds.push({
            date: isNaN(entry.valueDate.getTime()) ? new Date() : entry.valueDate,
            source: entry.bookingText,
            amount,
            type: ExpenseType.Auto,
            userId: req.user.id
          })
        } else {
          const category = expensesCategories.find(cat =>
            cat.keywords.some(keyword =>
              entry.bookingText.toLowerCase().includes(keyword.toLowerCase())
            )
          );
          const amount = entry.debitCHF || -entry.creditCHF || 0;
          expenses.push({
            userId: req.user.id,
            date: isNaN(entry.valueDate.getTime()) ? new Date() : entry.valueDate,
            categoryId: (amount !== 0 && category) ? category.id : null,
            description: entry.bookingText,
            vendor: entry.paymentPurpose,
            amount,
            type: ExpenseType.Auto,
            tags: []
          });
        }
      })
      await prisma.fund.createMany({ data: funds });
      await prisma.expense.createMany({ data: expenses });

      res.json({ message: 'CSV processed successfully', data: results });
    })
    .on('error', (err) => {
      console.error('Error parsing CSV:', err);
      res.status(500).send('Error parsing CSV.');
    });
});

router.delete("/auto", async (req: Request, res: Response) => {
  await prisma.expense.deleteMany({
    where: {
      userId: req.user.id,
      type: ExpenseType.Auto
    }
  });
  await prisma.fund.deleteMany({
    where: {
      userId: req.user.id,
      type: ExpenseType.Auto
    }
  })
  res.json({ message: 'Automated expenses deleted successfully' });
});

// Expenses
// TODO: Handle cash expenses (separate from bank balance calculation, but still part of statistics)

router.get('/', async (req: Request, res: Response) => {
  const { type } = req.query;
  const searchText = (req.query.searchText as string ?? '').trim();
  const filterCategoryIds = (req.query.filterCategoryIds as string ?? "-1").split(",").map(Number);

  const unCategorizedxpenses = !filterCategoryIds.includes(-3) ? [] :
    await prisma.expense.findMany({
      where: {
        userId: req.user.id,
        type: type === 'all' ? undefined : type as ExpenseType,
        category: null,
        OR: [
          { description: { contains: searchText, mode: 'insensitive' } },
          { vendor: { contains: searchText, mode: 'insensitive' } },
          { tags: { hasSome: [searchText] } },
          { category: { name: { contains: searchText, mode: 'insensitive' } } },
        ],
      },
      orderBy: { date: 'desc' },
      include: { category: true },
    });

  const expenses = await prisma.expense.findMany({
    where: {
      userId: req.user.id,
      type: type === 'all' ? undefined : type as ExpenseType,
      categoryId: filterCategoryIds.includes(-1) ? undefined : { in: filterCategoryIds },
      OR: [
        { description: { contains: searchText, mode: 'insensitive' } },
        { vendor: { contains: searchText, mode: 'insensitive' } },
        { tags: { hasSome: [searchText] } },
        { category: { name: { contains: searchText, mode: 'insensitive' } } },
      ],
    },
    orderBy: { date: 'desc' },
    include: { category: true },
  });

  const combined = [...expenses, ...unCategorizedxpenses].sort((a, b) => b.date.getTime() - a.date.getTime());
  res.json(combined);
});

router.post('/', async (req: Request, res: Response) => {
  const { categoryId, ...data } = req.body;

  const newExpense = await prisma.expense.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      description: data.description,
      vendor: data.vendor,
      amount: data.amount,
      type: data.type,
    },
    include: { category: true },
  });

  res.json(newExpense);
});

router.post('/:id', async (req: Request, res: Response) => {
  const expenseId = Number(req.params.id);
  const { categoryId, ...data } = req.body;

  const updatedExpense = await prisma.expense.update({
    where: { id: expenseId },
    data: {
      date: new Date(data.date),
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      description: data.description,
      vendor: data.vendor,
      amount: data.amount,
      type: data.type
    },
    include: { category: true },
  });

  res.json(updatedExpense);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const expenseId = Number(req.params.id);
  await prisma.expense.delete({ where: { id: expenseId } });
  res.json({ message: 'Expense deleted successfully' });
});

export default router;
