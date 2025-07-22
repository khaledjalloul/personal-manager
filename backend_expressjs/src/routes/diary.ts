import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) || new Date().getFullYear();
  const month = parseInt(req.query.month as string) || new Date().getMonth();
  const searchText = (req.query.searchText as string) ?? "";

  const entries = await prisma.diaryEntry.findMany({
    where: {
      userId: req.user?.id,
      ...(
        searchText.trim() ? {
          OR: [
            { content: { contains: searchText.trim(), mode: 'insensitive' } },
            { workContent: { contains: searchText.trim(), mode: 'insensitive' } },
          ],
        } : {
          date: {
            gte: new Date(year, month, 1),
            lt: new Date(year, month + 1, 1),
          }
        }
      )
    },
    orderBy: { date: 'asc' },
  });

  res.json(entries);
});

router.post('/', async (req: Request, res: Response) => {
  const { date, content, workContent } = req.body;
  const newEntry = await prisma.diaryEntry.create({
    data: {
      userId: req.user!.id,
      date: new Date(date),
      content,
      workContent
    },
  });
  res.json(newEntry);
});

router.post('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  const { date, content, workContent } = req.body;
  const updatedEntry = await prisma.diaryEntry.update({
    where: { id: entryId },
    data: {
      ...(date && { date: new Date(date) }),
      content,
      workContent
    },
  });
  res.json(updatedEntry);
});

export default router;
