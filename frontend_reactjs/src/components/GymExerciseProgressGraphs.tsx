import { Box, FormControl, FormControlLabel, Radio, RadioGroup, useTheme } from "@mui/material"
import {
  Chart as ChartJS, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
} from 'chart.js';
import { useContext, useEffect, useMemo, useState } from "react";
import { ThemeContext } from "../utils";
import { useGymExerciseTypes, useGymSessions } from "../api";
import { Bar, Line } from "react-chartjs-2";
import dayjs from "dayjs";

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

export const GymExerciseProgressGraphs = ({
  searchText
}: {
  searchText: string
}) => {
  const { palette } = useTheme();
  const { themeData } = useContext(ThemeContext);

  const [selectedLineGraphExerciseType, setSelectedLineGraphExerciseType] = useState<number>(-1);
  const [lineGraphValueType, setLineGraphValueType] = useState<"Weight" | "Volume">("Weight");

  const { data: allExerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: false });
  const { data: sessions } = useGymSessions({ searchText: searchText.trim() });

  useEffect(() => {
    if (allExerciseTypes && allExerciseTypes.length > 0)
      setSelectedLineGraphExerciseType(allExerciseTypes[0].id);
  }, [allExerciseTypes]);

  const lineChartData = useMemo(() => {
    const exerciseType = allExerciseTypes?.find((t) => t.id === selectedLineGraphExerciseType);
    if (!exerciseType || !sessions) return { days: [], lineChartData: { labels: [], datasets: [] } };

    const firstMonth = dayjs(sessions[0].date).startOf('month');
    const today = dayjs().endOf('day');

    const days = [];
    let currentDay = firstMonth;
    while (currentDay.isBefore(today)) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    const data = days.map((day) => {
      const session = sessions.find((s) => dayjs(s.date).isSame(day, 'day'));
      if (!session) return null;

      const exercise = session.exercises.find((e) => e.type.id === selectedLineGraphExerciseType);
      const value = lineGraphValueType === "Weight" ? exercise?.weight : (exercise?.weight ?? 0) * (exercise?.reps ?? 0) * (exercise?.sets ?? 0);
      return exercise ? value : null;
    });

    return {
      days,
      lineChartData: {
        labels: days.map((day) => day.date() === 1 ? day.format('MMM') : ""),
        datasets: [{
          label: exerciseType.name,
          data,
          backgroundColor: palette.primary.main,
          borderColor: palette.primary.main,
        }],
      }
    };

  }, [sessions, allExerciseTypes, selectedLineGraphExerciseType, lineGraphValueType]);

  if (!sessions) return <Box />
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
    }}>
      <FormControl sx={{ alignSelf: 'center', mb: 2 }}>
        <RadioGroup
          row
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          value={lineGraphValueType}
          onChange={(e) => setLineGraphValueType(e.target.value as "Weight" | "Volume")}
        >
          <FormControlLabel value="Weight" control={<Radio />} label="Weight" />
          <FormControlLabel value="Volume" control={<Radio />} label="Volume" />
        </RadioGroup>
      </FormControl>

      <FormControl sx={{ alignSelf: 'center', mb: 2 }}>
        <RadioGroup
          row
          sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
          value={selectedLineGraphExerciseType}
          onChange={(e) => setSelectedLineGraphExerciseType(parseInt(e.target.value))}
        >
          {allExerciseTypes?.map((type) => (
            <FormControlLabel key={type.id} value={type.id} control={<Radio />} label={type.name} />
          ))}
        </RadioGroup>
      </FormControl>

      <Box sx={{
        width: '100%',
        alignSelf: 'center',
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        justifyContent: { xs: 'start', lg: 'space-around' },
        gap: { xs: 5, lg: 0 }
      }}>
        <Box sx={{ width: { xs: '100%', lg: '45%' } }}>
          <Line
            data={lineChartData.lineChartData}
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
                    callback: (value, index) => lineChartData.lineChartData.labels[index] || null,
                    font: {
                      size: 16
                    }
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: ({ dataIndex, raw }) => {
                      const day = lineChartData.days[dataIndex].format("MMMM D, YYYY");
                      return `${day} - ${lineGraphValueType}: ${raw} kg`;
                    },
                  },
                  displayColors: false,
                }
              },
              spanGaps: true,
            }} />
        </Box>

        <Box sx={{ width: { xs: '100%', lg: '45%' } }}>
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
                tooltip: {
                  displayColors: false,
                }
              }
            }} />
        </Box>
      </Box>
    </Box>
  )
}