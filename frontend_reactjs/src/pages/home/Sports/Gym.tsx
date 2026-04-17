import {
  Box,
  FormControl,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  useTheme
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGymExerciseTypes, useGymSessions } from "../../../api";
import { GymExerciseTypeContainer, GymSessionTableRow } from "../../../components";
import { useContext, useEffect, useState } from "react";
import { Add } from "@mui/icons-material";
import { Bar, Line } from "react-chartjs-2";
import { ThemeContext } from "../../../utils";
import dayjs from "dayjs";
import {
  Chart as ChartJS, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const Gym = () => {
  const { palette } = useTheme();
  const { themeData } = useContext(ThemeContext);

  const { searchText } = useOutletContext<{ searchText: string }>();

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [graphExerciseType, setGraphExerciseType] = useState<number>(-1);

  const { data: allExerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: false });
  const { data: exerciseTypesInTable } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: true });
  const { data: sessions } = useGymSessions({ searchText: searchText.trim(), sortOrder });

  const sessionsAsc = (sortOrder === 'asc' ? sessions : sessions?.slice().reverse()) ?? [];

  useEffect(() => {
    if (allExerciseTypes && allExerciseTypes.length > 0)
      setGraphExerciseType(allExerciseTypes[0].id);
  }, [allExerciseTypes]);

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
        Progress
      </Typography>

      <FormControl sx={{ alignSelf: 'center' }}>
        <RadioGroup
          row
          value={graphExerciseType}
          onChange={(e) => setGraphExerciseType(parseInt(e.target.value))}
        >
          {allExerciseTypes?.map((type) => (
            <FormControlLabel key={type.id} value={type.id} control={<Radio />} label={type.name} />
          ))}
        </RadioGroup>
      </FormControl>

      {sessions &&
        <Box sx={{ width: '75%', alignSelf: 'center' }}>
          <Line
            data={{
              labels: sessionsAsc.map((s) => dayjs(s.date).format('DD.MM.YYYY')),
              datasets: allExerciseTypes?.find((t) => t.id === graphExerciseType) ? [{
                label: allExerciseTypes?.find((t) => t.id === graphExerciseType)?.name,
                data: sessionsAsc.map((session) => session.exercises.find((e) => e.type.id === graphExerciseType)?.weight),
                backgroundColor: palette.primary.main,
                borderColor: palette.primary.main,
              }] : [],
            }}
            options={{
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value} kg`,
                    color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                    stepSize: 5
                  },
                  beginAtZero: true,
                },
                x: {
                  ticks: {
                    color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
              }
            }} />
        </Box>
      }

      <Typography variant="h5" sx={{ mt: 3 }}>
        Exercise Count
      </Typography>

      {sessions &&
        <Box sx={{ width: '75%', alignSelf: 'center' }}>
          <Bar data={{
            labels: allExerciseTypes?.map(t => t.name) ?? [],
            datasets: [{
              label: 'Exercise Count',
              data: allExerciseTypes?.map(type => type._count?.exercises),
              backgroundColor: palette.primary.main,
            }],
          }}
            options={{
              scales: {
                y: {
                  ticks: {
                    color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                  },
                  beginAtZero: true,
                },
                x: {
                  ticks: {
                    color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
              }
            }} />
        </Box>
      }

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">
          Sessions ({sessions?.length ?? 0})
        </Typography>

        <IconButton onClick={() => setIsAddingSession(true)}>
          <Add />
        </IconButton>
      </Box>

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
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active
                    onClick={() => setSortOrder((prev) => prev === 'asc' ? 'desc' : 'asc')}
                    direction={sortOrder}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                {exerciseTypesInTable?.map((type) => (
                  <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }} key={type.id}>
                    {type.name}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold' }}>Note</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAddingSession && (
                <GymSessionTableRow
                  key={-1}
                  session={{
                    id: -1,
                    date: new Date(),
                    note: "",
                    exercises: []
                  }}
                  index={-1}
                  searchText={searchText}
                  isAddingSession={isAddingSession}
                  setIsAddingSession={setIsAddingSession}
                />
              )}
              {sessions?.map((session, index) => (
                <GymSessionTableRow
                  key={session.id}
                  session={session}
                  index={index}
                  searchText={searchText}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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