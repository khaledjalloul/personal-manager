import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// Categories

router.get('/categories', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const categories = await prisma.journalCategory.findMany({
    where: {
      userId: req.user.id,
      OR: [
        { sections: { some: { entries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } },
        { sections: { some: { entries: { some: { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } } } },
        !searchText ? { id: { gt: 0 } } : {}
      ]
    },
    include: {
      sections: {
        select: {
          entries: {
            where: {
              OR: [
                { content: { contains: searchText, mode: 'insensitive' } },
                { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } }
              ]
            },
            select: {
              id: true,
            }
          }
        }
      }
    },
    orderBy: [
      { order: 'asc' },
      { name: 'asc' }
    ],
  });
  res.json(categories);
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name, color } = req.body;
  const category = await prisma.journalCategory.create({
    data: {
      user: { connect: { id: req.user.id } },
      name,
      color,
      order: await prisma.journalCategory.count({ where: { userId: req.user.id } })
    }
  });
  res.json(category);
});

router.post('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);
  const { name, order, color } = req.body;

  if (order !== undefined) {
    const categoryToUpdate = await prisma.journalCategory.findUnique({ where: { id: categoryId } });

    if (order < categoryToUpdate!.order) {
      await prisma.journalCategory.updateMany({
        where: {
          userId: req.user.id,
          order: {
            gte: order,
            lt: categoryToUpdate!.order
          }
        },
        data: {
          order: {
            increment: 1
          }
        }
      });
    } else if (order > categoryToUpdate!.order) {
      await prisma.journalCategory.updateMany({
        where: {
          userId: req.user.id,
          order: {
            gt: categoryToUpdate!.order,
            lte: order
          }
        },
        data: {
          order: {
            decrement: 1
          }
        }
      });
    }
  }

  const category = await prisma.journalCategory.update({
    where: { id: categoryId },
    data: { name, order, color }
  });
  res.json(category);
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);

  const deletedCategory = await prisma.journalCategory.delete({ where: { id: categoryId } });

  await prisma.journalCategory.updateMany({
    where: {
      userId: req.user.id,
      order: { gt: deletedCategory.order }
    },
    data: {
      order: { decrement: 1 }
    }
  });

  res.json({ message: 'Category deleted successfully' });
});

// Sections

router.get('/sections', async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  const searchText = (req.query.searchText as string) ?? "";

  const sections = await prisma.journalSection.findMany({
    where: {
      categoryId: categoryId ? parseInt(categoryId) : undefined,
      OR: [
        { entries: { some: { content: { contains: searchText, mode: 'insensitive' } } } },
        { entries: { some: { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } },
        !searchText ? { id: { gt: 0 } } : {}
      ]
    },
    include: {
      _count: {
        select: {
          entries: {
            where: {
              OR: [
                { content: { contains: searchText, mode: 'insensitive' } },
                { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } },
              ]
            }
          }
        }
      },
      category: {
        select: {
          name: true,
          color: true
        }
      }
    },
    orderBy: [
      { category: { order: 'asc' } },
      { category: { name: 'asc' } },
      { order: 'asc' },
      { name: 'asc' }
    ],
  });

  res.json(sections);
});

router.post('/sections', async (req: Request, res: Response) => {
  const { name, categoryId } = req.body;
  const section = await prisma.journalSection.create({
    data: {
      user: { connect: { id: req.user.id } },
      name,
      order: await prisma.journalSection.count({ where: { userId: req.user.id } }),
      category: categoryId && { connect: { id: categoryId } }
    }
  });
  res.json(section);
});

router.post('/sections/:id', async (req: Request, res: Response) => {
  const sectionId = parseInt(req.params.id);
  const { name, order } = req.body;

  if (order !== undefined) {
    const sectionToUpdate = await prisma.journalSection.findUnique({ where: { id: sectionId } });
    if (order < sectionToUpdate!.order) {
      await prisma.journalSection.updateMany({
        where: {
          userId: req.user.id,
          order: {
            gte: order,
            lt: sectionToUpdate!.order
          }
        },
        data: {
          order: {
            increment: 1
          }
        }
      });
    } else if (order > sectionToUpdate!.order) {
      await prisma.journalSection.updateMany({
        where: {
          userId: req.user.id,
          order: {
            gt: sectionToUpdate!.order,
            lte: order
          }
        },
        data: {
          order: {
            decrement: 1
          }
        }
      });
    }
  }

  const section = await prisma.journalSection.update({
    where: { id: sectionId },
    data: { name, order }
  });
  res.json(section);
});

router.delete('/sections/:id', async (req: Request, res: Response) => {
  const sectionId = parseInt(req.params.id);

  const deletedSection = await prisma.journalSection.delete({ where: { id: sectionId } });

  await prisma.journalSection.updateMany({
    where: {
      userId: req.user.id,
      order: { gt: deletedSection.order }
    },
    data: {
      order: { decrement: 1 }
    }
  });

  res.json({ message: 'Section deleted successfully' });
});

// Journal Entries

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  const sectionIdsStr = req.query.sectionIds as string | undefined ?? ""
  const sectionIds = sectionIdsStr === "" ? [] : sectionIdsStr.split(',').map(id => parseInt(id));
  const sortOrder = (req.query.sortOrder as "asc" | "desc") ?? "asc";

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: req.user.id,
      sections: { some: { id: { in: sectionIds } } },
      OR: [
        { content: { contains: searchText, mode: 'insensitive' } },
        { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } }
      ]
    },
    include: {
      subEntries: {
        orderBy: { id: 'asc' },
      },
      sections: {
        select: {
          id: true,
          category: {
            select: {
              color: true
            }
          }
        },
        orderBy: [
          { order: 'asc' },
          { name: 'asc' }
        ]
      }
    },
    orderBy: { date: sortOrder },
  });

  res.json(entries);
});

router.post('/', async (req: Request, res: Response) => {
  const { date, content, subEntries, sectionIds } = req.body;

  const entry = await prisma.journalEntry.create({
    data: {
      user: { connect: { id: req.user.id } },
      date,
      content,
      subEntries: {
        createMany: {
          data: subEntries.map((subEntry: string) => ({
            content: subEntry
          }))
        }
      },
      sections: {
        connect: sectionIds.map((id: number) => ({ id }))
      }
    },
  });
  res.json(entry);
});

router.post('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  const { date, content, subEntries, sectionIds, sectionIdsToRemove } = req.body;

  await prisma.journalSubEntry.deleteMany({
    where: { entryId }
  });

  const entry = await prisma.journalEntry.update({
    where: { id: entryId },
    data: {
      userId: req.user.id,
      date,
      content,
      subEntries: {
        createMany: {
          data: subEntries.map((subEntry: string) => ({
            content: subEntry
          }))
        }
      },
      sections: {
        connect: sectionIds.map((id: number) => ({ id })),
        disconnect: sectionIdsToRemove?.map((id: number) => ({ id }))
      }
    },
  });
  res.json(entry);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  await prisma.journalEntry.delete({ where: { id: entryId } });
  res.json({ message: 'Entry deleted successfully' });
});

export default router;
