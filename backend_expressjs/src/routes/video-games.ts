import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  res.json({ message: `Hello ${req.user?.email}, here are your expenses.` });
});

export default router;
