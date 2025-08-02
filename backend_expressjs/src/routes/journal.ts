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
        { name: { contains: searchText, mode: 'insensitive' } },
        { sections: { some: { name: { contains: searchText, mode: 'insensitive' } } } },
        { sections: { some: { entries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } },
        { sections: { some: { entries: { some: { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } } } }
      ]
    },
    include: {
      sections: {
        select: {
          entries: {
            where: {
              OR: [
                { section: { category: { name: { contains: searchText, mode: 'insensitive' } } } },
                { section: { name: { contains: searchText, mode: 'insensitive' } } },
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
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await prisma.journalCategory.create({
    data: {
      user: { connect: { id: req.user.id } },
      name
    }
  });
  res.json(category);
});

router.post('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);
  const { name } = req.body;
  const category = await prisma.journalCategory.update({
    where: { id: categoryId },
    data: { name }
  });
  res.json(category);
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);

  await prisma.journalCategory.delete({ where: { id: categoryId } });
  res.json({ message: 'Category deleted successfully' });
});

// Sections

router.get('/sections', async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  const searchText = (req.query.searchText as string) ?? "";

  if (!categoryId) return res.json([]);

  const sections = await prisma.journalSection.findMany({
    where: {
      categoryId: parseInt(categoryId),
      OR: [
        { category: { name: { contains: searchText, mode: 'insensitive' } } },
        { name: { contains: searchText, mode: 'insensitive' } },
        { entries: { some: { content: { contains: searchText, mode: 'insensitive' } } } },
        { entries: { some: { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } } } }
      ]
    },
    orderBy: { name: 'asc' },
  });

  res.json(sections);
});

router.post('/sections', async (req: Request, res: Response) => {
  const { name, categoryId } = req.body;
  const section = await prisma.journalSection.create({
    data: {
      user: { connect: { id: req.user.id } },
      name,
      category: categoryId && { connect: { id: categoryId } }
    }
  });
  res.json(section);
});

router.post('/sections/:id', async (req: Request, res: Response) => {
  const sectionId = parseInt(req.params.id);
  const { name } = req.body;
  const section = await prisma.journalSection.update({
    where: { id: sectionId },
    data: { name }
  });
  res.json(section);
});

router.delete('/sections/:id', async (req: Request, res: Response) => {
  const sectionId = parseInt(req.params.id);

  await prisma.journalSection.delete({ where: { id: sectionId } });
  res.json({ message: 'Section deleted successfully' });
});

// Journal Entries

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  const sectionId = req.query.sectionId as string | undefined;

  let entries;
  if (sectionId) {
    const sectionIdSearch = sectionId === "-1" ? null : parseInt(sectionId)
    entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.user.id,
        sectionId: sectionIdSearch,
        OR: [
          { section: { category: { name: { contains: searchText, mode: 'insensitive' } } } },
          { section: { name: { contains: searchText, mode: 'insensitive' } } },
          { content: { contains: searchText, mode: 'insensitive' } },
          { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } }
        ]
      },
      include: {
        subEntries: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { date: 'asc' },
    });
  } else {
    entries = await prisma.journalEntry.findMany({
      where: {
        userId: req.user.id,
        OR: [
          { section: { category: { name: { contains: searchText, mode: 'insensitive' } } } },
          { section: { name: { contains: searchText, mode: 'insensitive' } } },
          { content: { contains: searchText, mode: 'insensitive' } },
          { subEntries: { some: { content: { contains: searchText, mode: 'insensitive' } } } }
        ]
      },
      include: {
        subEntries: {
          orderBy: { id: 'asc' },
        },
      },
      orderBy: { date: 'asc' },
    });
  }

  res.json(entries);
});

router.post('/', async (req: Request, res: Response) => {
  const { date, content, subEntries, sectionId } = req.body;

  // TODO: Create separate routes for sub-entries
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
      section: sectionId && { connect: { id: sectionId } }
    },
  });
  res.json(entry);
});

router.post('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  const { date, content, subEntries } = req.body;

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
