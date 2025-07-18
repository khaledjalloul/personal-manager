import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

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
    include: {
      extraPurchases: true,
    },
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
      completed: data.completed,
      price: data.price,
      // TODO: Implement extra purchases
      // extraPurchases: {
      //   connect: 
      // },
      coverImage: data.coverImage,
      storeUrl: data.storeUrl
    },
  });
  res.json(newVideoGame);
});

router.post('/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);
  const data = req.body;
  const updatedGame = await prisma.videoGame.update({
    where: { id: gameId },
    data: {
      name: data.name,
      platform: data.platform,
      type: data.type,
      firstPlayed: new Date(data.firstPlayed),
      completed: data.completed,
      price: data.price,
      // TODO: Implement extra purchases
      // extraPurchases: {
      //   connect: 
      // },
      coverImage: data.coverImage,
      storeUrl: data.storeUrl
    }
  });
  res.json(updatedGame);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id, 10);
  await prisma.videoGame.delete({ where: { id: gameId } });
  res.json({ message: 'Video game deleted successfully' });
});

export default router;
