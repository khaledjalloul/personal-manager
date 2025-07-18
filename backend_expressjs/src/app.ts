import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth';
import expensesRoutes from './routes/expenses';
import diaryRoutes from './routes/diary';
import pianoRoutes from './routes/piano';
import notesRoutes from './routes/notes';
import hikesRoutes from './routes/hikes';
import videoGamesRoutes from './routes/video-games';
import authMiddleware from './middleware/authMiddleware';

dotenv.config({ path: '.env' });
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

// Public
app.use('/auth', authRoutes);

// Protected
app.use('/expenses', authMiddleware, expensesRoutes);
app.use('/diary', authMiddleware, diaryRoutes);
app.use('/piano', authMiddleware, pianoRoutes);
app.use('/notes', authMiddleware, notesRoutes);
app.use('/hikes', authMiddleware, hikesRoutes);
app.use('/video-games', authMiddleware, videoGamesRoutes);

app.listen(PORT, () => {
  console.info(`Server ready at http://localhost:${PORT}`);
});
