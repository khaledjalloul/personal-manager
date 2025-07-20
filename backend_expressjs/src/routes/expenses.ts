import { Router } from 'express';
import { ExpenseType, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import dayjs, { Dayjs } from 'dayjs';
import csv from 'csv-parser';
import { Readable } from 'stream';
import multer from 'multer';
import customParseFormat from 'dayjs/plugin/customParseFormat';

const router = Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

dayjs.extend(customParseFormat);

// Incomes

router.get('/incomes', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const incomes = await prisma.income.findMany({
    where: {
      userId: req.user?.id,
      source: { contains: searchText.trim(), mode: 'insensitive' }
    },
    orderBy: { date: 'desc' },
  });
  res.json(incomes);
});

router.post('/incomes', async (req: Request, res: Response) => {
  const { date, source, amount } = req.body;
  const newIncome = await prisma.income.create({
    data: {
      userId: req.user!.id,
      date: new Date(date),
      source,
      amount
    }
  });
  res.json(newIncome);
});

router.post('/incomes/:id', async (req: Request, res: Response) => {
  const incomeId = Number(req.params.id);
  const { date, source, amount } = req.body;
  const updatedIncome = await prisma.income.update({
    where: { id: incomeId },
    data: {
      date: new Date(date),
      source,
      amount
    }
  });
  res.json(updatedIncome);
});

router.delete('/incomes/:id', async (req: Request, res: Response) => {
  const incomeId = Number(req.params.id);
  await prisma.income.delete({ where: { id: incomeId } });
  res.json({ message: 'Income deleted successfully' });
});

// Category Keywords

router.get('/categories/keywords', async (req: Request, res: Response) => {
  const categoryId = Number(req.query.categoryId ?? 0);
  const keywords = await prisma.expensesCategoryKeyword.findMany({
    where: { categoryId },
    include: { category: true },
    orderBy: { keyword: 'asc' },
  });
  res.json(keywords);
});

router.post('/categories/keywords', async (req: Request, res: Response) => {
  const { categoryId, keyword } = req.body;
  const category = await prisma.expensesCategory.findUnique({ where: { id: categoryId } });
  if (!category) return res.status(400).json({ error: 'Category not found' });

  const newKeyword = await prisma.expensesCategoryKeyword.create({
    data: {
      category: { connect: { id: categoryId } },
      keyword
    },
    include: { category: true },
  });

  res.json(newKeyword);
});

router.delete('/categories/keywords/:id', async (req: Request, res: Response) => {
  const keywordId = Number(req.params.id);
  await prisma.expensesCategoryKeyword.delete({ where: { id: keywordId } });
  res.json({ message: 'Keyword deleted successfully' });
});

// Categories

router.get('/categories', async (_req: Request, res: Response) => {
  const categories = await prisma.expensesCategory.findMany({
    where: { userId: _req.user?.id },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name, color } = req.body;
  const newCategory = await prisma.expensesCategory.create({
    data: {
      userId: req.user!.id,
      name,
      color
    }
  });
  res.json(newCategory);
});

router.post('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);
  const { name, color } = req.body;
  const updatedCategory = await prisma.expensesCategory.update({
    where: { id: categoryId },
    data: {
      name,
      color
    }
  });
  res.json(updatedCategory);
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = Number(req.params.id);

  await prisma.expense.updateMany({
    where: { categoryId },
    data: { categoryId: null },
  });

  await prisma.expensesCategoryKeyword.deleteMany({
    where: { categoryId }
  });

  await prisma.expensesCategory.delete({ where: { id: categoryId } });
  res.json({ message: 'Category deleted successfully' });
});

// Statistics

router.get('/monthly', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string || '').trim();

  const monthlyExpenses: {
    [month: string]: {
      [category: string]: number;
      total: number;
    };
  } = {};

  const categoryNames = (await prisma.expensesCategory.findMany({
    where: { userId: req.user?.id },
    orderBy: { name: 'asc' },
    select: { name: true },
  })).map(c => c.name);

  const expenses = await prisma.expense.findMany({
    where: { userId: req.user?.id },
    orderBy: { date: 'desc' },
    include: { category: true },
  });

  expenses.forEach(expense => {
    const dayjsDate = dayjs(expense.date);
    if (!dayjsDate.format("MMMM YYYY").toLowerCase().includes(searchText.trim().toLowerCase()))
      return;

    const monthStr = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;

    if (!monthlyExpenses[monthStr]) {
      monthlyExpenses[monthStr] = { total: 0 };
      monthlyExpenses[monthStr]["Uncategorized"] = 0;
      for (const category of categoryNames) {
        monthlyExpenses[monthStr][category] = 0;
      }
    }
    if (expense.category)
      monthlyExpenses[monthStr][expense.category.name] += expense.amount;
    else
      monthlyExpenses[monthStr]["Uncategorized"] += expense.amount;
    monthlyExpenses[monthStr].total += expense.amount;
  });

  res.json(monthlyExpenses);
});

router.get('/statistics', async (req: Request, res: Response) => {
  const statistics: {
    totalMonthlyAverage: number;
    totalExpenses: number;
    totalExpensesThisMonth: number;
    categories: {
      [category: string]: {
        monthlyAverage: number;
        total: number;
      };
    }
    months: {
      [month: string]: {
        expenses: number;
        incomes: number;
      }
    }
  } = {
    totalMonthlyAverage: 0,
    totalExpenses: 0,
    totalExpensesThisMonth: 0,
    categories: {},
    months: {}
  };

  const categories = (await prisma.expensesCategory.findMany({
    where: { userId: req.user?.id },
    orderBy: { name: 'asc' },
  }));
  categories.push({ id: -1, name: "Uncategorized", color: "gray", userId: -1 });

  const expenses = await prisma.expense.findMany({
    where: { userId: req.user?.id },
    orderBy: { date: 'asc' },
    include: { category: true },
  });

  const incomes = await prisma.income.findMany({
    where: { userId: req.user?.id },
    orderBy: { date: 'asc' },
  });

  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  for (var { date, category, amount } of expenses ?? []) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!category) {
      category = categories?.find(cat => cat.id === -1)!;
    }

    if (!statistics.categories[category.name]) {
      statistics.categories[category.name] = { monthlyAverage: 0, total: 0 };
    }

    if (!statistics.months[month]) {
      statistics.months[month] = { expenses: 0, incomes: 0 };
    }

    statistics.categories[category.name].total += amount;
    statistics.months[month].expenses += amount;
    statistics.totalExpenses += amount;

    if (month === thisMonth) {
      statistics.totalExpensesThisMonth += amount;
    }
  }

  for (const { date, amount } of incomes ?? []) {
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!statistics.months[month]) {
      statistics.months[month] = { expenses: 0, incomes: 0 };
    }

    statistics.months[month].incomes += amount;
  }

  const numMonths = Object.keys(statistics.months).length;
  for (const category in statistics.categories) {
    statistics.categories[category].monthlyAverage = statistics.categories[category].total / numMonths;
    statistics.totalMonthlyAverage += statistics.categories[category].monthlyAverage;
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

type AutoExpense = {
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

router.post("/auto", upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).send('No file uploaded.');

  const results: AutoExpense[] = [];
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
      const categories = await prisma.expensesCategory.findMany({
        where: { userId: req.user?.id },
        select: { id: true, keywords: true },
      });

      await prisma.expense.createMany({
        data: results.map(expense => {
          const amount = expense.debitCHF || -expense.creditCHF || 0;
          const category = categories.find(cat =>
            cat.keywords.some(keyword =>
              expense.bookingText.toLowerCase().includes(keyword.keyword.toLowerCase())
            )
          );
          return {
            userId: req.user!.id,
            date: isNaN(expense.valueDate.getTime()) ? new Date() : expense.valueDate,
            categoryId: amount !== 0 ? category?.id : undefined,
            description: expense.bookingText,
            vendor: expense.paymentPurpose,
            amount,
            type: "auto",
          }
        })
      });

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
      userId: req.user?.id,
      type: "auto"
    }
  });
  res.json({ message: 'Automated expenses deleted successfully' });
});

// Expenses

router.get('/', async (req: Request, res: Response) => {
  const { type } = req.query;
  const searchText = (req.query.searchText as string || '').trim();

  const expenses = await prisma.expense.findMany({
    where: {
      userId: req.user?.id,
      type: type === 'all' ? undefined : type as ExpenseType,
      OR: [
        { description: { contains: searchText.trim(), mode: 'insensitive' } },
        { vendor: { contains: searchText.trim(), mode: 'insensitive' } },
        { tags: { hasSome: [searchText.trim()] } },
        { category: { name: { contains: searchText.trim(), mode: 'insensitive' } } },
      ],
    },
    orderBy: { date: 'desc' },
    include: { category: true },
  });

  res.json(expenses);
});

router.post('/', async (req: Request, res: Response) => {
  const { categoryId, ...data } = req.body;

  const newExpense = await prisma.expense.create({
    data: {
      userId: req.user!.id,
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
