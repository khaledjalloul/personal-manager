import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const pianoPieces = await prisma.pianoPiece.findMany({
    where: {
      userId: req.user.id,
      OR: [
        { name: { contains: searchText, mode: 'insensitive' } },
        { origin: { contains: searchText, mode: 'insensitive' } },
        { composer: { contains: searchText, mode: 'insensitive' } },
      ]
    },
    orderBy: [{ isFavorite: 'desc' }, { monthLearned: 'desc' }],
  });
  res.json(pianoPieces);
});

router.post('/', async (req: Request, res: Response) => {
  const data = req.body;
  const newPianoPiece = await prisma.pianoPiece.create({
    data: {
      user: { connect: { id: req.user.id } },
      name: data.name,
      composer: data.composer,
      origin: data.origin,
      status: data.status,
      monthLearned: data.monthLearned ? new Date(data.monthLearned) : null,
      sheetMusicUrl: data.sheetMusicUrl,
      youtubeUrl: data.youtubeUrl,
      isFavorite: data.isFavorite,
    },
  });
  res.json(newPianoPiece);
});

router.post('/:id', async (req: Request, res: Response) => {
  const pieceId = parseInt(req.params.id);
  const data = req.body;
  const updatedPiece = await prisma.pianoPiece.update({
    where: { id: pieceId },
    data: {
      name: data.name,
      composer: data.composer,
      origin: data.origin,
      status: data.status,
      monthLearned: data.monthLearned,
      sheetMusicUrl: data.sheetMusicUrl,
      youtubeUrl: data.youtubeUrl,
      isFavorite: data.isFavorite,
    }
  });
  res.json(updatedPiece);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const pieceId = parseInt(req.params.id);
  await prisma.pianoPiece.delete({
    where: { id: pieceId },
  });
  res.json({ message: 'Piano piece deleted successfully' });
});

export default router;
