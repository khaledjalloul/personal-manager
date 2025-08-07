import {
  DiaryEntry,
  Expense,
  Hike,
  Fund,
  Note,
  PianoPiece,
  VideoGame,
  JournalSubEntry,
  ToDoTask
} from "@prisma/client";
import { Request, Response, Router } from "express";
import multer from "multer";
import prisma from '../utils/prisma';
import bcrypt from 'bcrypt';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// Backup

router.get('/backup/:dataType', async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { dataType } = req.params

  const dataTypes = dataType === 'all' ?
    ['expenses', 'diary', 'journal', 'notes', 'piano', 'hikes', 'video-games'] :
    [dataType];
  let data: any = {};

  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        data.expensesCategories = await prisma.expensesCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            expenses: {
              omit: { id: true, userId: true, categoryId: true },
              orderBy: { date: 'asc' }
            }
          },
          orderBy: {
            name: 'asc'
          }
        });
        data.uncategorizedExpenses = await prisma.expense.findMany({
          where: { userId, category: null },
          omit: { id: true, userId: true, categoryId: true },
          orderBy: { date: 'asc' }
        });
        data.funds = await prisma.fund.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { fundKeywords: true, wallet: true }
        })
        data.fundKeywords = user?.fundKeywords.sort();
        data.wallet = user?.wallet;
        break;

      case 'diary':
        data.diary = await prisma.diaryEntry.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        break;

      case 'journal':
        data.journalCategories = await prisma.journalCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            sections: {
              omit: { id: true, userId: true, categoryId: true },
              orderBy: { name: 'asc' },
              include: {
                entries: {
                  omit: { id: true, userId: true, sectionId: true },
                  orderBy: { date: 'asc' },
                  include: {
                    subEntries: {
                      omit: { id: true, entryId: true },
                      orderBy: { id: 'asc' }
                    }
                  }
                }
              }
            }
          },
          orderBy: { name: 'asc' }
        });
        data.uncategorizedJournalEntries = await prisma.journalEntry.findMany({
          where: { userId, section: null },
          omit: { id: true, userId: true, sectionId: true },
          orderBy: { date: 'asc' }
        });

      case 'todo':
        data.toDoMilestones = await prisma.toDoMilestone.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            tasks: {
              omit: { id: true, userId: true, milestoneId: true },
              orderBy: { id: 'asc' }
            }
          }
        });
        data.toDoTasks = await prisma.toDoTask.findMany({
          where: { userId, milestone: null },
          omit: { id: true, userId: true, milestoneId: true },
          orderBy: { date: 'asc' }
        });
        break;

      case 'notes':
        data.noteCategories = await prisma.noteCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            notes: {
              omit: { id: true, userId: true, categoryId: true },
              orderBy: { title: 'asc' }
            }
          },
          orderBy: { name: 'asc' }
        });
        data.uncategorizedNotes = await prisma.note.findMany({
          where: { userId, categoryId: null },
          omit: { id: true, userId: true, categoryId: true },
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

router.post('/restore/:dataType', upload.single('file'), async (req: Request, res: Response) => {
  const userId = req.user.id;
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
    ? ['expenses', 'diary', 'journal', 'todo', 'notes', 'piano', 'hikes', 'video-games']
    : [dataType];


  // Validate all input data before starting with the delete and restore operations 
  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        if (!inputData.expensesCategories ||
          !inputData.uncategorizedExpenses ||
          !inputData.funds ||
          !inputData.fundKeywords ||
          !inputData.wallet)
          return res.status(400).json({ error: "Invalid expenses data" });
        break;
      case 'diary':
        if (!inputData.diary)
          return res.status(400).json({ error: "Invalid diary data" });
        break;
      case 'journal':
        if (!inputData.journalCategories || !inputData.uncategorizedJournalEntries)
          return res.status(400).json({ error: "Invalid journal data" });
        break;
      case 'notes':
        if (!inputData.noteCategories || !inputData.uncategorizedNotes)
          return res.status(400).json({ error: "Invalid notes data" });
        break;
      case 'todo':
        if (!inputData.toDoMilestones || !inputData.toDoTasks)
          return res.status(400).json({ error: "Invalid todo data" });
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
        await prisma.fund.deleteMany({ where: { userId } });
        await prisma.expensesCategory.deleteMany({ where: { userId } });

        for (const cat of inputData.expensesCategories) {
          const { expenses, ...catData } = cat;
          const createdCat = await prisma.expensesCategory.create({
            data: { ...catData, userId },
          });
          if (expenses && expenses.length) {
            await prisma.expense.createMany({
              data: expenses.map((e: Expense) => ({
                ...e,
                userId,
                categoryId: createdCat.id
              })),
            });
          }
        }
        await prisma.expense.createMany({
          data: inputData.uncategorizedExpenses.map((e: Expense) => ({ ...e, userId })),
        });
        await prisma.fund.createMany({
          data: inputData.funds.map((f: Fund) => ({ ...f, userId })),
        });
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            wallet: inputData.wallet,
            fundKeywords: inputData.fundKeywords
          }
        })
        break;

      case 'diary':
        await prisma.diaryEntry.deleteMany({ where: { userId } });
        await prisma.diaryEntry.createMany({
          data: inputData.diary.map((d: DiaryEntry) => ({ ...d, userId })),
        });
        break;

      case 'journal':
        await prisma.journalEntry.deleteMany({ where: { userId } });
        await prisma.journalSection.deleteMany({ where: { userId } });
        await prisma.journalCategory.deleteMany({ where: { userId } });

        for (const cat of inputData.journalCategories) {
          const { sections, ...catData } = cat;
          const createdCat = await prisma.journalCategory.create({
            data: { ...catData, userId },
          });
          if (sections && sections.length) {
            for (const section of sections) {
              const { entries, ...sectionData } = section;
              const createdSection = await prisma.journalSection.create({
                data: { ...sectionData, userId, categoryId: createdCat.id },
              });
              if (entries && entries.length) {
                for (const entry of entries) {
                  const { subEntries, ...entryData } = entry;
                  const createdEntry = await prisma.journalEntry.create({
                    data: { ...entryData, userId, sectionId: createdSection.id },
                  });
                  if (subEntries && subEntries.length) {
                    await prisma.journalSubEntry.createMany({
                      data: subEntries.map((se: JournalSubEntry) => ({
                        content: se.content,
                        entryId: createdEntry.id
                      }))
                    });
                  }
                }
              }
            }
          }
        }
        for (const entry of inputData.uncategorizedJournalEntries) {
          const { subEntries, ...entryData } = entry;
          const createdEntry = await prisma.journalEntry.create({
            data: { ...entryData, userId },
          });
          if (subEntries && subEntries.length) {
            await prisma.journalSubEntry.createMany({
              data: subEntries.map((se: JournalSubEntry) => ({
                content: se.content,
                entryId: createdEntry.id
              }))
            });
          }
        }
        break;

      case 'todo':
        await prisma.toDoTask.deleteMany({ where: { userId } });
        await prisma.toDoMilestone.deleteMany({ where: { userId } });

        for (const milestone of inputData.toDoMilestones) {
          const { tasks, ...milestoneData } = milestone;
          const createdMilestone = await prisma.toDoMilestone.create({
            data: { ...milestoneData, userId },
          });
          if (tasks && tasks.length) {
            await prisma.toDoTask.createMany({
              data: tasks.map((t: ToDoTask) => ({
                ...t,
                userId,
                milestoneId: createdMilestone.id
              })),
            });
          }
        }
        await prisma.toDoTask.createMany({
          data: inputData.toDoTasks.map((t: ToDoTask) => ({ ...t, userId })),
        });
        break;

      case 'notes':
        await prisma.note.deleteMany({ where: { userId } });
        await prisma.noteCategory.deleteMany({ where: { userId } });

        for (const cat of inputData.noteCategories) {
          const { notes, ...catData } = cat;
          const createdCat = await prisma.noteCategory.create({
            data: { ...catData, userId },
          });
          if (notes && notes.length) {
            await prisma.note.createMany({
              data: notes.map((n: Note) => ({
                ...n,
                userId,
                categoryId: createdCat.id
              })),
            });
          }
        }
        await prisma.note.createMany({
          data: inputData.uncategorizedNotes.map((n: Note) => ({ ...n, userId })),
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
    where: { id: req.user.id },
    omit: { hash: true }
  });
  res.json(user);
});

router.post('/me', async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { name, email, wallet, fundKeywords, oldPassword, newPassword } = req.body;

  if (email) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser && existingUser.id !== userId) {
      return res.status(409).json({ error: "Email already in use" });
    }
  }

  let hash: string | undefined;
  if (newPassword) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(oldPassword, user.hash))) {
      return res.status(400).json({ error: "Invalid old password" });
    }
    hash = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      wallet,
      fundKeywords,
      hash
    }
  });

  res.json(updatedUser);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { id } = req.params;

  if (Number(id) !== userId) {
    return res.status(403).json({ error: "You can only delete your own account" });
  }

  await prisma.user.delete({ where: { id: userId } });
  res.json({ status: "User deleted successfully" });
});

export default router;