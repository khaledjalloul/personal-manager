import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import dayjs from 'dayjs';
import { CalendarEntry } from '@prisma/client';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const date = (req.query.date as string) ? new Date(req.query.date as string) : new Date();
  var fixedDate = dayjs(date);
  // Fix the date to ensure that the week starts on a Monday not a Sunday
  if (fixedDate.day() === 0) // 0 = Sunday
    fixedDate = fixedDate.subtract(1, 'day');
  const startOfWeek = dayjs(fixedDate).startOf('week').add(1, 'day').startOf('day');
  const endOfWeek = dayjs(fixedDate).endOf('week').add(1, 'day').endOf('day');

  const calendarEntries = await prisma.calendarEntry.findMany({
    where: {
      userId: req.user.id,
      ...(!searchText ?
        {
          OR: [
            { startDate: { gte: startOfWeek.toDate(), lte: endOfWeek.toDate() } },
            { endDate: { gte: startOfWeek.toDate(), lte: endOfWeek.toDate() } }
          ]
        } :
        {
          OR: [
            { title: { contains: searchText, mode: 'insensitive' } },
            { description: { contains: searchText, mode: 'insensitive' } },
            { location: { contains: searchText, mode: 'insensitive' } }
          ]
        }
      )
    },
    orderBy: { startDate: 'asc' },
  });
  res.json(calendarEntries);
});

router.post('/', async (req: Request, res: Response) => {
  const repeatUntilDate = req.body.repeatUntilDate || req.body.endDate;

  const untilDate = dayjs(repeatUntilDate).add(2, 'hour'); // Accomodate for possible timezone changes
  const newEntries: Omit<CalendarEntry, 'id'>[] = [];
  let currentStartDate = dayjs(req.body.startDate);
  let currentEndDate = dayjs(req.body.endDate);

  while (currentStartDate.isBefore(untilDate)) {
    newEntries.push({
      userId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      startDate: currentStartDate.toDate(),
      endDate: currentEndDate.toDate(),
    });

    currentStartDate = currentStartDate.add(1, 'week');
    currentEndDate = currentEndDate.add(1, 'week');
  }

  const createdEntries = await prisma.calendarEntry.createMany({
    data: newEntries,
  });

  res.json(createdEntries);
});

router.post('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  const data = req.body;
  const updatedEntry = await prisma.calendarEntry.update({
    where: { id: entryId },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    }
  });
  res.json(updatedEntry);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const entryId = parseInt(req.params.id);
  await prisma.calendarEntry.delete({
    where: { id: entryId },
  });
  res.json({ message: 'Calendar entry deleted successfully' });
});

export default router;
