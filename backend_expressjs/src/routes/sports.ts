import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import multer from 'multer';
import FitParser from 'fit-file-parser';
import { Run } from '@prisma/client';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

const syncFromStrava = async (authorizationCode: string, sportType: string) => {

  const oath_params = {
    "client_id": process.env.STRAVA_CLIENT_ID,
    "client_secret": process.env.STRAVA_CLIENT_SECRET,
    "code": authorizationCode,
    "grant_type": "authorization_code",
  }

  const access_token = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(oath_params),
  }).then(res => res.json()).then(data => data.access_token).catch(err => {
    console.error("Error exchanging authorization code for access token:", err);
    throw err;
  });

  const strava_activities = await fetch("https://www.strava.com/api/v3/athlete/activities", {
    headers: {
      "Authorization": `Bearer ${access_token}`,
    },
  }).then(res => res.json()).catch(err => {
    console.error("Error fetching activities from Strava API:", err);
    throw err;
  })

  return strava_activities.filter((activity: any) => activity.type === sportType);
};

const runningFitParser = new FitParser({
  force: true,
  speedUnit: 'km/h',
  lengthUnit: 'km',
  temperatureUnit: 'celsius',
  pressureUnit: 'bar',
  elapsedRecordField: true,
  mode: 'cascade',
})

router.get('/hikes', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const hikes = await prisma.hike.findMany({
    where: {
      userId: req.user.id,
      description: { contains: searchText, mode: 'insensitive' }
    },
    orderBy: { date: 'asc' },
  });
  res.json(hikes);
});

router.post('/hikes', async (req: Request, res: Response) => {
  const data = req.body;
  const newHike = await prisma.hike.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      description: data.description,
      distance: data.distance,
      ascent: data.ascent,
      descent: data.descent,
      movingTime: data.movingTime,
      elapsedTime: data.elapsedTime,
      coverImage: data.coverImage,
      googleMapsUrl: data.googleMapsUrl,
      stravaActivityId: data.stravaActivityId,
      mapPolyline: data.mapPolyline,
    },
  });
  res.json(newHike);
});


router.post('/hikes/sync', async (req: Request, res: Response) => {
  const { authorizationCode } = req.body;

  const strava_activities = await syncFromStrava(authorizationCode, 'Hike').catch(err => {
    console.error("Error syncing from Strava:", err);
    return res.status(500).json({ message: 'Error syncing from Strava' });
  });

  strava_activities.forEach(async (activity: any) => {
    const existingHike = await prisma.hike.findFirst({
      where: {
        userId: req.user.id,
        stravaActivityId: activity.id.toString(),
      }
    });
    if (existingHike) return;

    await prisma.hike.create({
      data: {
        user: { connect: { id: req.user.id } },
        date: new Date(activity.start_date),
        description: activity.name,
        distance: activity.distance / 1000, // km
        ascent: activity.total_elevation_gain,
        descent: 0,
        movingTime: activity.moving_time,
        elapsedTime: activity.elapsed_time,
        coverImage: "",
        googleMapsUrl: "",
        stravaActivityId: activity.id.toString(),
        mapPolyline: activity.map?.summary_polyline ?? "",
      },
    });
  });
  res.json({ message: 'Strava sync successful' });
});

router.post('/hikes/:id', async (req: Request, res: Response) => {
  const hikeId = parseInt(req.params.id);
  const data = req.body;
  const updatedHike = await prisma.hike.update({
    where: { id: hikeId },
    data: {
      date: new Date(data.date),
      description: data.description,
      distance: data.distance,
      ascent: data.ascent,
      descent: data.descent,
      movingTime: data.movingTime,
      elapsedTime: data.elapsedTime,
      coverImage: data.coverImage,
      googleMapsUrl: data.googleMapsUrl,
      stravaActivityId: data.stravaActivityId,
      mapPolyline: data.mapPolyline,
    }
  });
  res.json(updatedHike);
});

router.delete('/hikes/:id', async (req: Request, res: Response) => {
  const hikeId = parseInt(req.params.id);
  await prisma.hike.delete({
    where: { id: hikeId },
  });
  res.json({ message: 'Hike deleted successfully' });
});

router.get('/gym/exercise-types', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  const searchInGymSessions = (req.query.searchInGymSessions as string) === 'true';

  const exerciseTypes = await prisma.gymExerciseType.findMany({
    where: {
      userId: req.user.id,
      OR: [
        { name: { contains: searchText, mode: 'insensitive' } },
        searchInGymSessions ? {} : { description: { contains: searchText, mode: 'insensitive' } },
        searchInGymSessions ? { exercises: { some: { session: { note: { contains: searchText, mode: 'insensitive' } } } } } : {},
        searchInGymSessions ? { exercises: { some: { note: { contains: searchText, mode: 'insensitive' } } } } : {}
      ]
    },
    include: {
      _count: {
        select: { exercises: true },
      },
    },
    orderBy: { name: 'asc' },
  });
  res.json(exerciseTypes);
});

router.post('/gym/exercise-types', async (req: Request, res: Response) => {
  const data = req.body;
  const newExerciseType = await prisma.gymExerciseType.create({
    data: {
      user: { connect: { id: req.user.id } },
      name: data.name,
      description: data.description,
    },
  });
  res.json(newExerciseType);
});

router.post('/gym/exercise-types/:id', async (req: Request, res: Response) => {
  const exerciseTypeId = parseInt(req.params.id);
  const { name, description } = req.body;
  const updatedExerciseType = await prisma.gymExerciseType.update({
    where: { id: exerciseTypeId },
    data: {
      name,
      description,
    }
  });
  res.json(updatedExerciseType);
});

router.delete('/gym/exercise-types/:id', async (req: Request, res: Response) => {
  const exerciseTypeId = parseInt(req.params.id);
  await prisma.gymExerciseType.delete({
    where: { id: exerciseTypeId },
  });
  res.json({ message: 'Gym exercise type deleted successfully' });
});

router.get('/gym/exercises', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const exercises = await prisma.gymExercise.findMany({
    where: {
      OR: [
        { note: { contains: searchText, mode: 'insensitive' } },
        { type: { name: { contains: searchText, mode: 'insensitive' } } },
        { type: { description: { contains: searchText, mode: 'insensitive' } } },
      ]
    },
    include: {
      type: true,
    },
  });
  res.json(exercises);
});

router.post('/gym/exercises', async (req: Request, res: Response) => {
  const data = req.body;
  const newExercise = await prisma.gymExercise.create({
    data: {
      type: { connect: { id: data.typeId } },
      session: { connect: { id: data.sessionId } },
      weight: data.weight,
      sets: data.sets,
      reps: data.reps,
      note: data.note,
    },
  });
  res.json(newExercise);
});

router.post('/gym/exercises/:id', async (req: Request, res: Response) => {
  const exerciseId = parseInt(req.params.id);
  const { sessionId, typeId, note, sets, reps, weight } = req.body;
  const updatedExercise = await prisma.gymExercise.update({
    where: { id: exerciseId },
    data: {
      type: { connect: { id: typeId } },
      session: { connect: { id: sessionId } },
      weight,
      sets,
      reps,
      note,
    }
  });
  res.json(updatedExercise);
});

router.delete('/gym/exercises/:id', async (req: Request, res: Response) => {
  const exerciseId = parseInt(req.params.id);
  await prisma.gymExercise.delete({
    where: { id: exerciseId },
  });
  res.json({ message: 'Gym exercise deleted successfully' });
});

router.get('/gym/sessions', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  const sortOrder = (req.query.sortOrder as string) === 'desc' ? 'desc' : 'asc';

  const sessions = await prisma.gymSession.findMany({
    where: {
      userId: req.user.id,
      OR: [
        { location: { contains: searchText, mode: 'insensitive' } },
        { note: { contains: searchText, mode: 'insensitive' } },
        { exercises: { some: { note: { contains: searchText, mode: 'insensitive' } } } },
        { exercises: { some: { type: { name: { contains: searchText, mode: 'insensitive' } } } } },
      ]
    },
    include: {
      exercises: {
        include: {
          type: {
            select: {
              id: true,
            }
          }
        }
      },
    },
    orderBy: { date: sortOrder },
  });
  res.json(sessions);
});

router.post('/gym/sessions', async (req: Request, res: Response) => {
  const data = req.body;
  const newSession = await prisma.gymSession.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      location: data.location,
      note: data.note,
      exercises: {
        create: data.exercises.map((exercise: any) => ({
          type: { connect: { id: exercise.type.id } },
          weight: exercise.weight,
          sets: exercise.sets,
          reps: exercise.reps,
          note: exercise.note,
        }))
      }
    },
  });
  res.json(newSession);
});

router.post('/gym/sessions/:id', async (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.id);
  const { date, location, note, exercises } = req.body;
  const updatedSession = await prisma.gymSession.update({
    where: { id: sessionId },
    data: {
      date: new Date(date),
      location,
      note,
      exercises: {
        deleteMany: {},
        create: exercises.map((exercise: any) => ({
          type: { connect: { id: exercise.type.id } },
          weight: exercise.weight,
          sets: exercise.sets,
          reps: exercise.reps,
          note: exercise.note,
        }))
      }
    }
  });
  res.json(updatedSession);
});

router.delete('/gym/sessions/:id', async (req: Request, res: Response) => {
  const sessionId = parseInt(req.params.id);
  await prisma.gymSession.delete({
    where: { id: sessionId },
  });
  res.json({ message: 'Gym session deleted successfully' });
});

router.get('/gym/last-exercises', async (req: Request, res: Response) => {
  const lastExercises = await prisma.gymExerciseType.findMany({
    where: {
      userId: req.user.id,
    },
    include: {
      exercises: {
        orderBy: { session: { date: 'desc' } },
        take: 1,
        include: {
          session: {
            select: {
              date: true,
            }
          }
        }
      }
    },
  });

  const sortedLastExercises = lastExercises.sort((a, b) => {
    const dateA = a.exercises[0]?.session.date ?? new Date(0);
    const dateB = b.exercises[0]?.session.date ?? new Date(0);
    return dateB.getTime() - dateA.getTime();
  });

  res.json(sortedLastExercises);
});

router.get('/runs', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";
  var orderBy = (req.query.orderBy as string) ?? 'date';
  orderBy = orderBy === 'pace' ? 'date' : orderBy; // handle 'pace' as a special case since it's not a real field in the database
  const orderDirection = (req.query.orderDirection as string) === 'asc' ? 'asc' : 'desc';

  const runs = await prisma.run.findMany({
    where: {
      userId: req.user.id,
      description: { contains: searchText, mode: 'insensitive' }
    },
    orderBy: { [orderBy]: orderDirection },
  });
  res.json(runs);
});

router.post('/runs', async (req: Request, res: Response) => {
  const data = req.body;
  const newRun = await prisma.run.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      description: data.description,
      distance: data.distance,
      movingTime: data.movingTime,
      elapsedTime: data.elapsedTime,
      elevationGain: data.elevationGain,
      stravaActivityId: data.stravaActivityId,
      mapPolyline: data.mapPolyline
    },
  });
  res.json(newRun);
});

router.post('/runs/upload', upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file)
    return res.status(400).send('No file uploaded.');

  // @ts-ignore
  const fitObject = await runningFitParser.parseAsync(req.file.buffer);
  if (!fitObject.activity || !fitObject.activity.sessions || fitObject.activity.sessions.length === 0)
    return res.status(400).send('Invalid FIT file: no activity sessions found.');

  const session = fitObject.activity.sessions[0];
  const runObject: Run = {
    id: -1,
    userId: req.user.id,
    date: new Date(session.start_time),
    description: "",
    distance: session.total_distance ?? 0,
    movingTime: session.total_timer_time ?? 0,
    elapsedTime: session.total_elapsed_time ?? 0,
    elevationGain: (session.total_ascent ?? 0) * 1000,
    stravaActivityId: "",
    mapPolyline: "",
  }

  res.json(runObject);
});

router.post('/runs/sync', async (req: Request, res: Response) => {
  const { authorizationCode } = req.body;

  const strava_activities = await syncFromStrava(authorizationCode, 'Run').catch(err => {
    console.error("Error syncing from Strava:", err);
    return res.status(500).json({ message: 'Error syncing from Strava' });
  });

  strava_activities.forEach(async (activity: any) => {
    const existingRun = await prisma.run.findFirst({
      where: {
        userId: req.user.id,
        stravaActivityId: activity.id.toString(),
      }
    });
    if (existingRun) return;

    await prisma.run.create({
      data: {
        user: { connect: { id: req.user.id } },
        date: new Date(activity.start_date),
        description: activity.name,
        distance: activity.distance / 1000, // km
        movingTime: activity.moving_time,
        elapsedTime: activity.elapsed_time,
        elevationGain: activity.total_elevation_gain,
        stravaActivityId: activity.id.toString(),
        mapPolyline: activity.map?.summary_polyline ?? "",
      },
    });
  });
  res.json({ message: 'Strava sync successful' });
});

router.post('/runs/:id', async (req: Request, res: Response) => {
  const runId = parseInt(req.params.id);
  const { description, date, distance, movingTime, elapsedTime, elevationGain, stravaActivityId, mapPolyline } = req.body;
  const updatedRun = await prisma.run.update({
    where: { id: runId },
    data: {
      date: new Date(date),
      description,
      distance,
      movingTime,
      elapsedTime,
      elevationGain,
      stravaActivityId,
      mapPolyline
    }
  });
  res.json(updatedRun);
});

router.delete('/runs/:id', async (req: Request, res: Response) => {
  const runId = parseInt(req.params.id);
  await prisma.run.delete({
    where: { id: runId },
  });
  res.json({ message: 'Run deleted successfully' });
});

router.get('/swims', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const swims = await prisma.swim.findMany({
    where: {
      userId: req.user.id,
      description: { contains: searchText, mode: 'insensitive' }
    },
    orderBy: { date: 'asc' },
  });
  res.json(swims);
});

router.post('/swims', async (req: Request, res: Response) => {
  const data = req.body;
  const newSwim = await prisma.swim.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      description: data.description,
    },
  });
  res.json(newSwim);
});

router.post('/swims/:id', async (req: Request, res: Response) => {
  const swimId = parseInt(req.params.id);
  const { description, date } = req.body;
  const updatedSwim = await prisma.swim.update({
    where: { id: swimId },
    data: {
      date: new Date(date),
      description,
    }
  });
  res.json(updatedSwim);
});

router.delete('/swims/:id', async (req: Request, res: Response) => {
  const swimId = parseInt(req.params.id);
  await prisma.swim.delete({
    where: { id: swimId },
  });
  res.json({ message: 'Swim deleted successfully' });
});

router.get('/volleyball-games', async (req: Request, res: Response) => {
  const searchText = (req.query.searchText as string) ?? "";

  const games = await prisma.volleyballGame.findMany({
    where: {
      userId: req.user.id,
      description: { contains: searchText, mode: 'insensitive' }
    },
    orderBy: { date: 'asc' },
  });
  res.json(games);
});

router.post('/volleyball-games', async (req: Request, res: Response) => {
  const data = req.body;
  const newGame = await prisma.volleyballGame.create({
    data: {
      user: { connect: { id: req.user.id } },
      date: new Date(data.date),
      description: data.description,
    },
  });
  res.json(newGame);
});

router.post('/volleyball-games/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id);
  const { description, date } = req.body;
  const updatedGame = await prisma.volleyballGame.update({
    where: { id: gameId },
    data: {
      date: new Date(date),
      description,
    }
  });
  res.json(updatedGame);
});

router.delete('/volleyball-games/:id', async (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id);
  await prisma.volleyballGame.delete({
    where: { id: gameId },
  });
  res.json({ message: 'Volleyball game deleted successfully' });
});

export default router;
