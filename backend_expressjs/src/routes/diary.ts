import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { DiaryEntryType } from '@prisma/client';
import dayjs from 'dayjs';

const router = Router();

router.get('/daily', async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) ?? new Date().getFullYear();
  const month = parseInt(req.query.month as string) ?? new Date().getMonth();
  const searchText = (req.query.searchText as string) ?? "";

  const entries = await prisma.diaryEntry.findMany({
    where: {
      userId: req.user.id,
      type: DiaryEntryType.Daily,
      ...(
        searchText ? {
          OR: [
            { content: { contains: searchText, mode: 'insensitive' } },
            { workContent: { contains: searchText, mode: 'insensitive' } },
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

router.get('/monthly', async (req: Request, res: Response) => {
  const year = parseInt(req.query.year as string) ?? new Date().getFullYear();
  const searchText = (req.query.searchText as string) ?? "";

  const allDates = await prisma.diaryEntry.findMany({
    where: {
      userId: req.user.id,
      type: DiaryEntryType.Daily,
      date: {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      }
    },
    select: {
      date: true,
    }
  });

  const months = Array.from(
    new Set(
      allDates.map(item => {
        const date = dayjs(item.date);
        return new Date(date.year(), date.month(), 1, 12).toISOString();
      })
    )
  ).map(date => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime());

  const entries = await prisma.diaryEntry.findMany({
    where: {
      userId: req.user.id,
      type: DiaryEntryType.Monthly,
      ...(
        searchText ? {
          OR: [
            { content: { contains: searchText, mode: 'insensitive' } },
            { workContent: { contains: searchText, mode: 'insensitive' } },
          ],
        } : {
          date: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1),
          }
        }
      ),
    },
    orderBy: { date: 'asc' },
  });

  res.json({ months, entries });
});

router.post('/', async (req: Request, res: Response) => {
  const { date, content, workContent, type } = req.body;
  const newEntry = await prisma.diaryEntry.create({
    data: {
      userId: req.user.id,
      date: new Date(date),
      content,
      workContent,
      type
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
