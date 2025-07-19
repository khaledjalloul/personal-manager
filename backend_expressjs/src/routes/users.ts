import {
  DiaryEntry,
  Expense,
  ExpensesCategoryKeyword,
  Hike,
  Income,
  Note,
  NoteCategory,
  PianoPiece,
  PrismaClient,
  VideoGame
} from "@prisma/client";
import { Request, Response, Router } from "express";
import multer from "multer";

const router = Router();
const prisma = new PrismaClient();

// Backup

router.get('/backup/:dataType', async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { dataType } = req.params

  const dataTypes = dataType === 'all' ?
    ['expenses', 'diary', 'notes', 'piano', 'hikes', 'video-games'] :
    [dataType];
  let data: any = {};

  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        data.expenses = await prisma.expense.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        data.incomes = await prisma.income.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        data.expensesCategories = await prisma.expensesCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            keywords: {
              omit: { id: true },
              orderBy: { keyword: 'asc' }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        break;
      case 'diary':
        data.diary = await prisma.diaryEntry.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        break;
      case 'notes':
        data.noteCategories = await prisma.noteCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { name: 'asc' }
        });
        data.notes = await prisma.note.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { title: 'asc' }
        });
        break;
      case 'piano':
        data.pianoPieces = await prisma.pianoPiece.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { monthLearned: 'asc' }
        });
        break;
      case 'hikes':
        data.hikes = await prisma.hike.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        break;
      case 'video-games':
        data.videoGames = await prisma.videoGame.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { name: 'asc' }
        });
        break;
      default:
        return res.status(400).json({ error: "Invalid data type" });
    }
  }

  const fileName = `backup=${dataType}-${new Date().toISOString()}.json`;

  res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
  res.setHeader('Content-Type', 'application/json');
  res.send(data);
});

// Restore

const upload = multer({ storage: multer.memoryStorage() });

router.post('/restore/:dataType', upload.single('file'), async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { dataType } = req.params;

  if (!req.file)
    return res.status(400).json({ error: "No file uploaded" });

  let inputData: any;
  try {
    inputData = JSON.parse(req.file.buffer.toString());
  } catch (err) {
    return res.status(400).json({ error: "Invalid JSON file" });
  }

  const dataTypes = dataType === 'all'
    ? ['expenses', 'diary', 'notes', 'piano', 'hikes', 'video-games']
    : [dataType];


  // Validate all input data before starting with the delete and restore operations 
  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        if (!inputData.expenses || !inputData.expensesCategories || !inputData.incomes)
          return res.status(400).json({ error: "Invalid expenses data" });
        break;
      case 'diary':
        if (!inputData.diary)
          return res.status(400).json({ error: "Invalid diary data" });
        break;
      case 'notes':
        if (!inputData.noteCategories || !inputData.notes)
          return res.status(400).json({ error: "Invalid notes data" });
        break;
      case 'piano':
        if (!inputData.pianoPieces)
          return res.status(400).json({ error: "Invalid piano pieces data" });
        break;
      case 'hikes':
        if (!inputData.hikes)
          return res.status(400).json({ error: "Invalid hikes data" });
        break;
      case 'video-games':
        if (!inputData.videoGames)
          return res.status(400).json({ error: "Invalid video games data" });
        break;
      default:
        return res.status(400).json({ error: "Invalid data type" });
    }
  }

  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        await prisma.expense.deleteMany({ where: { userId } });
        await prisma.income.deleteMany({ where: { userId } });
        for (const cat of await prisma.expensesCategory.findMany({ where: { userId }, select: { id: true } })) {
          await prisma.expensesCategoryKeyword.deleteMany({ where: { categoryId: cat.id } });
        }
        await prisma.expensesCategory.deleteMany({ where: { userId } });

        for (const cat of inputData.expensesCategories) {
          const { keywords, ...catData } = cat;
          const createdCat = await prisma.expensesCategory.create({
            data: { ...catData, userId },
          });
          if (keywords && keywords.length) {
            await prisma.expensesCategoryKeyword.createMany({
              data: keywords.map((k: ExpensesCategoryKeyword) => ({
                ...k,
                expensesCategoryId: createdCat.id,
              })),
            });
          }
        }
        await prisma.expense.createMany({
          data: inputData.expenses.map((e: Expense) => ({ ...e, userId })),
        });
        await prisma.income.createMany({
          data: inputData.incomes.map((i: Income) => ({ ...i, userId })),
        });
        break;

      case 'diary':
        await prisma.diaryEntry.deleteMany({ where: { userId } });
        await prisma.diaryEntry.createMany({
          data: inputData.diary.map((d: DiaryEntry) => ({ ...d, userId })),
        });
        break;

      case 'notes':
        await prisma.note.deleteMany({ where: { userId } });
        await prisma.noteCategory.deleteMany({ where: { userId } });

        await prisma.noteCategory.createMany({
          data: inputData.noteCategories.map((c: NoteCategory) => ({ ...c, userId })),
        });
        await prisma.note.createMany({
          data: inputData.notes.map((n: Note) => ({ ...n, userId })),
        });
        break;

      case 'piano':
        await prisma.pianoPiece.deleteMany({ where: { userId } });
        await prisma.pianoPiece.createMany({
          data: inputData.pianoPieces.map((p: PianoPiece) => ({ ...p, userId })),
        });
        break;

      case 'hikes':
        await prisma.hike.deleteMany({ where: { userId } });
        await prisma.hike.createMany({
          data: inputData.hikes.map((h: Hike) => ({ ...h, userId })),
        });
        break;

      case 'video-games':
        await prisma.videoGame.deleteMany({ where: { userId } });
        await prisma.videoGame.createMany({
          data: inputData.videoGames.map((v: VideoGame) => ({ ...v, userId })),
        });
        break;

      default:
        return res.status(400).json({ error: "Invalid data type" });
    }
  }

  res.json({ status: "Restore completed" });
});

router.get('/me', async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user?.id },
    select: {
      id: true,
      name: true,
      email: true,
    }
  });
  res.json(user);
});

router.post('/me', async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { name, email } = req.body;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email
    }
  });

  res.json(updatedUser);
});

export default router;