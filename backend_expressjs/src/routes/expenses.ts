import { Router } from 'express';
import { ExpenseType, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

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
