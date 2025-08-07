import { Router } from 'express';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import prisma from '../utils/prisma';

const router = Router();

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      isApproved: false,
      wallet: 0,
      hash
    }
  });
  const token = generateToken({ id: user.id, email: user.email });

  res.json({ token });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isApproved) {
    return res.status(403).json({ message: 'Account not approved' });
  }

  const token = generateToken({ id: user.id, email: user.email });
  res.json({ token });
});

export default router;
