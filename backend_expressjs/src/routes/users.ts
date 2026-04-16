import {
  DiaryEntry,
  Expense,
  Hike,
  Fund,
  Note,
  PianoPiece,
  VideoGame,
  JournalSubEntry,
  ToDoTask,
  CalendarEntry
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
  const { includePrivateContent } = req.query as { includePrivateContent?: string };
  const includePrivate = includePrivateContent === 'true';

  const dataTypes = dataType === 'all' ?
    ['expenses', 'calendar', 'diary', 'journal', 'to-do', 'notes', 'piano', 'sports', 'video-games'] :
    [dataType];
  let data: any = {};

  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        data.expenses = {};
        data.expenses.categories = await prisma.expensesCategory.findMany({
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
        data.expenses.uncategorized = await prisma.expense.findMany({
          where: { userId, category: null },
          omit: { id: true, userId: true, categoryId: true },
          orderBy: { date: 'asc' }
        });
        data.expenses.funds = await prisma.fund.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        const user = await prisma.user.findUnique({
          where: { id: req.user.id },
          select: { fundKeywords: true, wallet: true }
        })
        data.expenses.fundKeywords = user?.fundKeywords.sort();
        data.expenses.wallet = user?.wallet;
        break;

      case 'calendar':
        data.calendar = await prisma.calendarEntry.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { startDate: 'asc' }
        });
        break;

      case 'diary':
        if (!includePrivate)
          break;
        data.diary = await prisma.diaryEntry.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });
        break;

      case 'journal':
        if (!includePrivate)
          break;
        data.journal = await prisma.journalCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            sections: {
              omit: { id: true, categoryId: true },
              orderBy: { name: 'asc' },
              include: {
                entries: {
                  omit: { id: true },
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
        break;

      case 'to-do':
        data.toDo = {};
        if (includePrivate)
          data.toDo.milestones = await prisma.toDoMilestone.findMany({
            where: { userId },
            omit: { id: true, userId: true },
            include: {
              tasks: {
                omit: { id: true, userId: true, milestoneId: true },
                orderBy: { id: 'asc' }
              }
            }
          });
        data.toDo.tasks = await prisma.toDoTask.findMany({
          where: { userId, milestone: null },
          omit: { id: true, userId: true, milestoneId: true },
          orderBy: { dateCreated: 'asc' }
        });
        break;

      case 'notes':
        data.notes = await prisma.noteCategory.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          include: {
            notes: {
              omit: { id: true, categoryId: true },
              orderBy: { title: 'asc' }
            }
          },
          orderBy: { name: 'asc' }
        });
        break;

      case 'piano':
        data.piano = await prisma.pianoPiece.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { monthLearned: 'asc' }
        });
        break;

      case 'sports':
        data.sports = {};
        data.sports.hikes = await prisma.hike.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });

        data.sports.gymSessions = await prisma.gymSession.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' },
          include: {
            exercises: {
              omit: { id: true, sessionId: true, typeId: true },
              orderBy: { id: 'asc' },
              include: {
                type: {
                  omit: { id: true, userId: true },
                }
              }
            }
          }
        });

        data.sports.volleyballGames = await prisma.volleyballGame.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });

        data.sports.swims = await prisma.swim.findMany({
          where: { userId },
          omit: { id: true, userId: true },
          orderBy: { date: 'asc' }
        });

        data.sports.runs = await prisma.run.findMany({
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
    ? ['expenses', 'calendar', 'diary', 'journal', 'to-do', 'notes', 'piano', 'sports', 'video-games']
    : [dataType];


  // Validate all input data before starting with the delete and restore operations 
  for (const type of dataTypes) {
    switch (type) {
      case 'expenses':
        if (!inputData.expenses.categories ||
          !inputData.expenses.uncategorized ||
          !inputData.expenses.funds ||
          !inputData.expenses.fundKeywords ||
          inputData.expenses.wallet === undefined)
          return res.status(400).json({ error: "Invalid expenses data" });
        break;
      case 'calendar':
        if (!inputData.calendar)
          return res.status(400).json({ error: "Invalid calendar data" });
        break;
      case 'diary':
        if (!inputData.diary) {
          if (dataType === 'diary')
            return res.status(400).json({ error: "Invalid diary data" });
          else
            inputData.diary = []; // Possible to not exist if private content is not included in the backup
        }
        break;
      case 'journal':
        if (!inputData.journal) {
          if (dataType === 'journal')
            return res.status(400).json({ error: "Invalid journal data" });
          else
            inputData.journal = []; // Possible to not exist
        }
        break;
      case 'to-do':
        if (!inputData.toDo.tasks)
          return res.status(400).json({ error: "Invalid todo data" });
        if (!inputData.toDo.milestones) {
          if (dataType === 'to-do')
            return res.status(400).json({ error: "Invalid todo data" });
          else
            inputData.toDo.milestones = []; // Possible to not exist
        }
        break;
      case 'notes':
        if (!inputData.notes)
          return res.status(400).json({ error: "Invalid notes data" });
        break;
      case 'piano':
        if (!inputData.piano)
          return res.status(400).json({ error: "Invalid piano data" });
        break;
      case 'sports':
        if (!inputData.sports.hikes ||
          !inputData.sports.gymSessions ||
          !inputData.sports.volleyballGames ||
          !inputData.sports.swims ||
          !inputData.sports.runs)
          return res.status(400).json({ error: "Invalid sports data" });
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

        for (const cat of inputData.expenses.categories) {
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
          data: inputData.expenses.uncategorized.map((e: Expense) => ({ ...e, userId })),
        });
        await prisma.fund.createMany({
          data: inputData.expenses.funds.map((f: Fund) => ({ ...f, userId })),
        });
        await prisma.user.update({
          where: { id: req.user.id },
          data: {
            wallet: inputData.expenses.wallet,
            fundKeywords: inputData.expenses.fundKeywords
          }
        })
        break;

      case 'calendar':
        await prisma.calendarEntry.deleteMany({ where: { userId } });
        await prisma.calendarEntry.createMany({
          data: inputData.calendar.map((e: CalendarEntry) => ({ ...e, userId })),
        });
        break;

      case 'diary':
        await prisma.diaryEntry.deleteMany({ where: { userId } });
        await prisma.diaryEntry.createMany({
          data: inputData.diary.map((d: DiaryEntry) => ({ ...d, userId })),
        });
        break;

      case 'journal':
        await prisma.journalEntry.deleteMany({ where: { sections: { some: { category: { userId } } } } });
        await prisma.journalSection.deleteMany({ where: { category: { userId } } });
        await prisma.journalCategory.deleteMany({ where: { userId } });

        for (const category of inputData.journal) {
          const { sections, ...catData } = category;
          const createdCategory = await prisma.journalCategory.create({
            data: { ...catData, userId },
          });
          if (sections && sections.length) {
            for (const section of sections) {
              const { entries, ...sectionData } = section;
              const createdSection = await prisma.journalSection.create({
                data: { ...sectionData, categoryId: createdCategory.id },
              });
              if (entries && entries.length) {
                for (const entry of entries) {
                  const existingEntry = await prisma.journalEntry.findFirst({
                    where: {
                      date: entry.date,
                      content: entry.content,
                    }
                  });
                  if (existingEntry) {
                    await prisma.journalSection.update({
                      where: { id: createdSection.id },
                      data: {
                        entries: {
                          connect: { id: existingEntry.id }
                        }
                      }
                    });
                    continue;
                  }
                  const { subEntries, ...entryData } = entry;
                  const createdEntry = await prisma.journalEntry.create({
                    data: { ...entryData, sections: { connect: { id: createdSection.id } } },
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
        break;

      case 'to-do':
        await prisma.toDoTask.deleteMany({ where: { userId } });
        await prisma.toDoMilestone.deleteMany({ where: { userId } });

        for (const milestone of inputData.toDo.milestones) {
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
          data: inputData.toDo.tasks.map((t: ToDoTask) => ({ ...t, userId })),
        });
        break;

      case 'notes':
        await prisma.note.deleteMany({ where: { category: { userId } } });
        await prisma.noteCategory.deleteMany({ where: { userId } });

        for (const category of inputData.notes) {
          const { notes, ...catData } = category;
          const createdCategory = await prisma.noteCategory.create({
            data: { ...catData, userId },
          });
          if (notes && notes.length) {
            await prisma.note.createMany({
              data: notes.map((n: Note) => ({ ...n, categoryId: createdCategory.id })),
            });
          }
        }
        break;

      case 'piano':
        await prisma.pianoPiece.deleteMany({ where: { userId } });
        await prisma.pianoPiece.createMany({
          data: inputData.piano.map((p: PianoPiece) => ({ ...p, userId })),
        });
        break;

      case 'sports':
        await prisma.hike.deleteMany({ where: { userId } });
        await prisma.hike.createMany({
          data: inputData.sports.hikes.map((h: Hike) => ({ ...h, userId })),
        });

        await prisma.gymSession.deleteMany({ where: { userId } }); // Cascades to gym exercises
        await prisma.gymExerciseType.deleteMany({ where: { userId } });
        for (const session of inputData.sports.gymSessions) {
          const { exercises, ...sessionData } = session;
          const createdSession = await prisma.gymSession.create({
            data: { ...sessionData, userId },
          });
          if (exercises && exercises.length) {
            for (const exercise of exercises) {
              const { type, ...exerciseData } = exercise;
              let typeId: number | null = null;
              const existingType = await prisma.gymExerciseType.findFirst({
                where: { userId, name: type.name, description: type.description }
              });
              if (existingType)
                typeId = existingType.id;
              else {
                const createdType = await prisma.gymExerciseType.create({
                  data: { ...type, userId },
                });
                typeId = createdType.id;
              }
              await prisma.gymExercise.create({
                data: {
                  ...exerciseData,
                  sessionId: createdSession.id,
                  typeId
                }
              });
            }
          }
        }

        await prisma.volleyballGame.deleteMany({ where: { userId } });
        await prisma.volleyballGame.createMany({
          data: inputData.sports.volleyballGames.map((g: any) => ({ ...g, userId })),
        });

        await prisma.swim.deleteMany({ where: { userId } });
        await prisma.swim.createMany({
          data: inputData.sports.swims.map((s: any) => ({ ...s, userId })),
        });

        await prisma.run.deleteMany({ where: { userId } });
        await prisma.run.createMany({
          data: inputData.sports.runs.map((r: any) => ({ ...r, userId })),
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