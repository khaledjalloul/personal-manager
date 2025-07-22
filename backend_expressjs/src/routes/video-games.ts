import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const videoGames = await prisma.videoGame.findMany({
    where: {
      userId: req.user?.id,
      OR: [
        { name: { contains: searchText.trim(), mode: 'insensitive' } },
        { platform: { contains: searchText.trim(), mode: 'insensitive' } },
      ]
    },
    orderBy: { name: 'asc' },
  });
  res.json(videoGames);
});

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const newVideoGame = await prisma.videoGame.create({
    data: {
      userId: req.user!.id,
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
