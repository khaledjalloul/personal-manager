import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const pianoPieces = await prisma.pianoPiece.findMany({
    where: { userId: req.user?.id },
    orderBy: { name: 'asc' },
  });
  res.json(pianoPieces);
});

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const newPianoPiece = await prisma.pianoPiece.create({
    data: {
      userId: req.user!.id,
      name: data.name,
      composer: data.composer,
      origin: data.origin,
      status: data.status,
      monthLearned: data.monthLearned ? new Date(data.monthLearned) : null,
      sheetMusicUrl: data.sheetMusicUrl,
      youtubeUrl: data.youtubeUrl
    },
  });
  res.json(newPianoPiece);
});

router.post('/:id', async (req: Request, res: Response) => {
  const pieceId = parseInt(req.params.id, 10);
  const data = req.body;
  const updatedPiece = await prisma.pianoPiece.update({
    where: { id: pieceId },
    data: {
      name: data.name,
      composer: data.composer,
      origin: data.origin,
      status: data.status,
      monthLearned: data.monthLearned ? new Date(data.monthLearned) : null,
      sheetMusicUrl: data.sheetMusicUrl,
      youtubeUrl: data.youtubeUrl
    }
  });
  res.json(updatedPiece);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const pieceId = parseInt(req.params.id, 10);
  await prisma.pianoPiece.delete({
    where: { id: pieceId },
  });
  res.json({ message: 'Piano piece deleted successfully' });
});

export default router;
