import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Typography } from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { useGymExerciseTypes, useGymSessions } from "../../../api";
import { GymExerciseTypeContainer, GymSessionTableRow } from "../../../components";
import { useState } from "react";
import { Add } from "@mui/icons-material";

export const Gym = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isAddingSession, setIsAddingSession] = useState(false);

  const { data: exerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim() });
  const { data: allExerciseTypes } = useGymExerciseTypes({ searchText: "" });
  const { data: sessions } = useGymSessions({ searchText: searchText.trim(), sortOrder });

  return (
    <Box sx={{
      overflowY: 'auto',
      p: '32px',
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h5">
          Sessions ({sessions?.length ?? 0})
        </Typography>

        <IconButton onClick={() => setIsAddingSession(true)}>
          <Add />
        </IconButton>
      </Box>

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
              {allExerciseTypes?.map((type) => (
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


      <Typography variant="h5" sx={{ mt: 3 }}>
        Exercise Types ({exerciseTypes?.length ?? 0})
      </Typography>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1
      }}>
        {exerciseTypes?.map((type) => (
          <GymExerciseTypeContainer key={type.id} exerciseType={type} />
        ))}
        <GymExerciseTypeContainer exerciseType={{ id: -1, name: "", description: "" }} />
      </Box>


    </Box>
  )
};