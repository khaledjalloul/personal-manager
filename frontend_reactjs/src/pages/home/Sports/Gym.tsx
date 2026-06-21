import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGymExerciseTypes, useGymLastExercises, useGymSessions } from "../../../api";
import { GymExerciseProgressGraphs, GymExerciseTypeContainer, GymSessionContainer } from "../../../components";
import { useState } from "react";
import { Add } from "@mui/icons-material";
import dayjs from "dayjs";

export const Gym = () => {

  const { searchText, highlightedId } = useOutletContext<{ searchText: string; highlightedId?: number }>();

  const [isAddingSession, setIsAddingSession] = useState(false);

  const { data: allExerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: false });
  const { data: sessions } = useGymSessions({ searchText: searchText.trim() });
  const { data: lastExercises } = useGymLastExercises();


  return (
    <Box sx={{
      overflowY: 'auto',
      p: '32px',
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>

      <Typography variant="h5">
        Last Exercises
      </Typography>

      <Box>
        <TableContainer component={Paper}>
          <Table
            size="small"
            stickyHeader
            sx={{
              '& th': {
                backgroundColor: "primary.main",
                color: "primary.contrastText"
              }
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Sets</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Reps</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lastExercises?.map((exerciseType, index) => {
                const hasExercises = exerciseType.exercises && exerciseType.exercises.length > 0;
                return <TableRow
                  key={exerciseType.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
                  }}
                >
                  <TableCell>{exerciseType.name}</TableCell>
                  <TableCell>{hasExercises ? `${exerciseType.exercises![0].sets}` : '-'}</TableCell>
                  <TableCell>{hasExercises ? `${exerciseType.exercises![0].reps}` : '-'}</TableCell>
                  <TableCell>{hasExercises ? `${exerciseType.exercises![0].weight} kg` : '-'}</TableCell>
                  <TableCell>{hasExercises ? dayjs(exerciseType.exercises![0].session.date).format("MMMM DD, YYYY") : '-'}</TableCell>
                  <TableCell>{hasExercises ? exerciseType.exercises![0].note : '-'}</TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Typography variant="h5" mt={3}>
        Exercise Progress
      </Typography>

      <GymExerciseProgressGraphs searchText={searchText} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
        <Typography variant="h5">
          Sessions ({sessions?.length ?? 0})
        </Typography>

        <IconButton onClick={() => setIsAddingSession(true)}>
          <Add />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginX: '-32px' }}>
        {isAddingSession && (
          <GymSessionContainer
            key={-1}
            session={{
              id: -1,
              date: new Date(),
              location: "",
              note: "",
              exercises: []
            }}
            searchText={searchText}
            highlightedId={highlightedId}
            isAddingSession={isAddingSession}
            setIsAddingSession={setIsAddingSession}
          />
        )}
        {sessions?.slice().reverse().map((session) => (
          <GymSessionContainer
            key={session.id}
            session={session}
            searchText={searchText}
            highlightedId={highlightedId}
          />
        ))}
      </Box>

      <Typography variant="h5" sx={{ mt: 3 }}>
        Exercise Types ({allExerciseTypes?.length ?? 0})
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {allExerciseTypes?.map((type) => (
          <GymExerciseTypeContainer key={type.id} exerciseType={type} />
        ))}
        <GymExerciseTypeContainer exerciseType={{ id: -1, name: "", description: "" }} />
      </Box>

    </Box>
  )
};