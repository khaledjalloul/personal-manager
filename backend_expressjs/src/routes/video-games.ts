import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { VideoGameType } from '@prisma/client';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  const sortByDate = req.query.sortByDate === 'true';
  const showUncompleted = req.query.showUncompleted === 'true';

  const videoGames = await prisma.videoGame.findMany({
    where: {
      userId: req.user.id,
      firstPlayed: showUncompleted ? { lt: new Date("2000-01-01") } :
        sortByDate ? { gte: new Date("2000-01-01") } : undefined,
      OR: [
        { name: { contains: searchText.trim(), mode: 'insensitive' } },
        { platform: { contains: searchText.trim(), mode: 'insensitive' } },
        { price: { contains: searchText.trim(), mode: 'insensitive' } },
        { extraPurchases: { contains: searchText.trim(), mode: 'insensitive' } }
      ]
    },
    orderBy: sortByDate ? { firstPlayed: 'asc' } : { name: 'asc' },
  });
  res.json(videoGames);
});

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const newVideoGame = await prisma.videoGame.create({
    data: {
      userId: req.user.id,
      name: data.name,
      platform: data.platform,
      type: data.type,
      firstPlayed: new Date(data.firstPlayed),
      completionCount: data.completionCount,
      price: data.price,
      extraPurchases: data.extraPurchases,
      coverImage: data.coverImage,
      storeUrl: data.storeUrl
    },
  });
  res.json(newVideoGame);
});

router.post('/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id);
  const data = req.body;
  const updatedGame = await prisma.videoGame.update({
    where: { id: gameId },
    data: {
      name: data.name,
      platform: data.platform,
      type: data.type,
      firstPlayed: new Date(data.firstPlayed),
      completionCount: data.completionCount,
      price: data.price,
      extraPurchases: data.extraPurchases,
      coverImage: data.coverImage,
      storeUrl: data.storeUrl
    }
  });
  res.json(updatedGame);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id);
  await prisma.videoGame.delete({ where: { id: gameId } });
  res.json({ message: 'Video game deleted successfully' });
});

export default router;
