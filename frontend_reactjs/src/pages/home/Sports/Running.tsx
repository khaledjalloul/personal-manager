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
  TableSortLabel,
  Typography
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useRuns } from "../../../api";
import { useMemo, useState } from "react";
import { RunningTableRow } from "../../../components";
import { Add } from "@mui/icons-material";
import { Run } from "../../../types";


export const Running = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const [isAddingRun, setIsAddingRun] = useState(false);
  const [orderBy, setOrderBy] = useState<keyof Run | 'pace'>('date');
  const [orderDirection, setOrderDirection] = useState<'asc' | 'desc'>('desc');

  const { data: runs } = useRuns({ searchText: searchText.trim(), orderBy, orderDirection });

  const handleSortClick = (field: keyof Run | 'pace') => {
    if (orderBy === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
    }
  };

  const runsSorted = useMemo(() => {
    if (orderBy === 'pace' && runs) {
      return runs.slice().sort((a, b) => {
        const paceA = a.duration / (a.distance || 1); // avoid division by zero
        const paceB = b.duration / (b.distance || 1);
        return orderDirection === 'asc' ? paceA - paceB : paceB - paceA;
      });
    }
    return runs;
  }, [orderBy, runs]);

  return (
    <Box sx={{ overflowY: 'auto', p: '32px', pt: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Typography variant="h5">
          Runs ({runs?.length ?? 0})
        </Typography>

        <IconButton onClick={() => setIsAddingRun(true)}>
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
                    active={orderBy === 'date'}
                    onClick={() => handleSortClick('date')}
                    direction={orderDirection}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'distance'}
                    onClick={() => handleSortClick('distance')}
                    direction={orderDirection}
                  >
                    Distance
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'duration'}
                    onClick={() => handleSortClick('duration')}
                    direction={orderDirection}
                  >
                    Duration
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'pace'}
                    onClick={() => handleSortClick('pace')}
                    direction={orderDirection}
                  >
                    Pace
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>
                  <TableSortLabel
                    active={orderBy === 'elevationGain'}
                    onClick={() => handleSortClick('elevationGain')}
                    direction={orderDirection}
                  >
                    Elevation Gain
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isAddingRun && (
                <RunningTableRow
                  key={-1}
                  run={{
                    id: -1,
                    date: new Date(),
                    description: "",
                    distance: 0,
                    duration: 0,
                    elevationGain: 0,
                  }}
                  index={-1}
                  searchText={searchText}
                  isAddingRun={isAddingRun}
                  setIsAddingRun={setIsAddingRun}
                />
              )}
              {runsSorted?.map((run, index) => (
                <RunningTableRow
                  key={run.id}
                  run={run}
                  index={index}
                  searchText={searchText}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  )
};