import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const hikes = await prisma.hike.findMany({
    where: {
      userId: req.user?.id,
      description: { contains: searchText.trim(), mode: 'insensitive' }
    },
    orderBy: { date: 'asc' },
  });
  res.json(hikes);
});

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const newHike = await prisma.hike.create({
    data: {
      userId: req.user!.id,
      description: data.description,
      date: new Date(data.date),
      distance: data.distance,
      ascent: data.ascent,
      descent: data.descent,
      duration: data.duration,
      durationWithBreaks: data.durationWithBreaks,
      coverImage: data.coverImage,
      googleMapsUrl: data.googleMapsUrl
    },
  });
  res.json(newHike);
});

router.post('/:id', async (req: Request, res: Response) => {
  const hikeId = parseInt(req.params.id);
  const data = req.body;
  const updatedHike = await prisma.hike.update({
    where: { id: hikeId },
    data: {
      description: data.description,
      date: new Date(data.date),
      distance: data.distance,
      ascent: data.ascent,
      descent: data.descent,
      duration: data.duration,
      durationWithBreaks: data.durationWithBreaks,
      coverImage: data.coverImage,
      googleMapsUrl: data.googleMapsUrl
    }
  });
  res.json(updatedHike);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const hikeId = parseInt(req.params.id, 10);
  await prisma.hike.delete({
    where: { id: hikeId },
  });
  res.json({ message: 'Hike deleted successfully' });
});

export default router;
