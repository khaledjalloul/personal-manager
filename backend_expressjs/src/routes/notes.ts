import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

// Note Categories

router.get('/categories', async (req: Request, res: Response) => {
  const categories = await prisma.noteCategory.findMany({
    where: { userId: req.user?.id },
    orderBy: { name: 'asc' },
  });
  res.json(categories);
});

router.post('/categories', async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await prisma.noteCategory.create({
    data: {
      userId: req.user!.id,
      name
    }
  });
  res.json(category);
});

router.post('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);
  const { name } = req.body;
  const category = await prisma.noteCategory.update({
    where: { id: categoryId },
    data: { name }
  });
  res.json(category);
});

router.delete('/categories/:id', async (req: Request, res: Response) => {
  const categoryId = parseInt(req.params.id);

  await prisma.note.updateMany({
    where: { categoryId },
    data: { categoryId: null }
  });

  await prisma.noteCategory.delete({ where: { id: categoryId } });
  res.json({ message: 'Category deleted successfully' });
});

// Notes

router.get('/', async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId as string | undefined;
  let notes;
  if (categoryId) {
    if (categoryId === '-1') {
      notes = await prisma.note.findMany({
        where: {
          userId: req.user?.id,
          categoryId: null
        },
        include: { category: true },
        orderBy: { title: 'asc' }
      });
    } else {
      notes = await prisma.note.findMany({
        where: {
          userId: req.user?.id,
          categoryId: parseInt(categoryId)
        },
        include: { category: true },
        orderBy: { title: 'asc' }
      });
    }
  } else {
    notes = await prisma.note.findMany({
      where: { userId: req.user?.id },
      include: { category: true },
      orderBy: { title: 'asc' }
    });
  }
  res.json(notes);
});

router.post('/', async (req: Request, res: Response) => {
  const { title, content, categoryId } = req.body;
  const newDate = new Date();
  const note = await prisma.note.create({
    data: {
      userId: req.user!.id,
      title,
      content,
      category: categoryId !== undefined ? { connect: { id: categoryId } } : undefined,
      dateCreated: newDate,
      dateModified: newDate
    },
    include: { category: true }
  });
  res.json(note);
});

router.post('/:id', async (req: Request, res: Response) => {
  const noteId = parseInt(req.params.id);
  const { title, content, categoryId } = req.body;
  const note = await prisma.note.update({
    where: { id: noteId },
    data: {
      userId: req.user!.id,
      title,
      content,
      category: categoryId !== undefined
        ? { connect: { id: categoryId } }
        : { disconnect: true },
      dateModified: new Date()
    },
    include: { category: true }
  });
  res.json(note);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const noteId = parseInt(req.params.id);
  await prisma.note.delete({ where: { id: noteId } });
  res.json({ message: 'Note deleted successfully' });
});

export default router;
