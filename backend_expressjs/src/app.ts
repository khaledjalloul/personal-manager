import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import expensesRoutes from './routes/expenses';
import diaryRoutes from './routes/diary';
import pianoRoutes from './routes/piano';
import notesRoutes from './routes/notes';
import hikesRoutes from './routes/hikes';
import videoGamesRoutes from './routes/video-games';
import authMiddleware from './middleware/authMiddleware';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(express.json());

// Public
app.use('/auth', authRoutes);

// Protected
app.use('/expenses', authMiddleware, expensesRoutes);
app.use('/diary', authMiddleware, diaryRoutes);
app.use('/piano', authMiddleware, pianoRoutes);
app.use('/notes', authMiddleware, notesRoutes);
app.use('/hikes', authMiddleware, hikesRoutes);
app.use('/video-games', authMiddleware, videoGamesRoutes);

export default app;
