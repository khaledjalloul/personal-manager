import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { ToDoTaskStatus } from '@prisma/client';

const router = Router();

// Milestones

router.get('/milestones', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const milestones = await prisma.toDoMilestone.findMany({
    where: {
      userId: req.user.id,
      OR: [
        { description: { contains: searchText, mode: 'insensitive' } },
        {
          tasks: {
            some: {
              OR: [
                { content: { contains: searchText, mode: 'insensitive' } },
              ]
            }
          }
        }
      ]
    },
    orderBy: { date: 'desc' },
  });

  res.json(milestones);
});

router.post('/milestones', async (req: Request, res: Response) => {
  const { date, description } = req.body;
  const milestone = await prisma.toDoMilestone.create({
    data: {
      user: { connect: { id: req.user.id } },
      date,
      description
    }
  });
  res.json(milestone);
});

router.post('/milestones/:id', async (req: Request, res: Response) => {
  const milestoneId = parseInt(req.params.id);
  const { date, description } = req.body;
  const milestone = await prisma.toDoMilestone.update({
    where: { id: milestoneId },
    data: { date, description }
  });
  res.json(milestone);
});

router.delete('/milestones/:id', async (req: Request, res: Response) => {
  const milestoneId = parseInt(req.params.id);

  await prisma.toDoMilestone.delete({ where: { id: milestoneId } });
  res.json({ message: 'Milestone deleted successfully' });
});

// Tasks

router.get('/', async (req: Request, res: Response) => {
  const milestoneId = req.query.milestoneId as string | undefined;
  const searchText = (req.query.searchText as string) ?? "";
  const isArchived = req.query.isArchived;

  let tasks;
  if (milestoneId) {
    const milestoneIdSearch = milestoneId ? parseInt(milestoneId) : undefined;
    tasks = await prisma.toDoTask.findMany({
      where: {
        userId: req.user.id,
        milestoneId: milestoneIdSearch,
        OR: [
          { milestone: { description: { contains: searchText, mode: 'insensitive' } } },
          { content: { contains: searchText, mode: "insensitive" } },
        ]
      },
      orderBy: { date: 'desc' }
    });
  } else {
    const statusesWhere = !isArchived ?
      [ToDoTaskStatus.Pending, ToDoTaskStatus.Completed, ToDoTaskStatus.NotCompleted] :
      isArchived === 'true' ?
        [ToDoTaskStatus.Completed, ToDoTaskStatus.NotCompleted] :
        [ToDoTaskStatus.Pending];

    tasks = await prisma.toDoTask.findMany({
      where: {
        userId: req.user.id,
        milestoneId: null,
        status: { in: statusesWhere },
        content: { contains: searchText, mode: "insensitive" }
      },
      orderBy: { date: 'desc' }
    });
  }
  res.json(tasks);
});

router.post('/', async (req: Request, res: Response) => {
  const { date, content, milestoneId } = req.body;
  const task = await prisma.toDoTask.create({
    data: {
      user: { connect: { id: req.user.id } },
      date,
      content,
      milestone: milestoneId !== undefined ? { connect: { id: milestoneId } } : undefined,
    },
  });
  res.json(task);
});

router.post('/:id', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const { date, content, status } = req.body;
  const task = await prisma.toDoTask.update({
    where: { id: taskId },
    data: {
      date,
      content,
      status
    },
  });
  res.json(task);
});

router.delete('/:id', async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  await prisma.toDoTask.delete({ where: { id: taskId } });
  res.json({ message: 'Task deleted successfully' });
});

export default router;
