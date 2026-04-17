import {
  Box,
  IconButton,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { GymExercise, GymSession } from "../types";
import { Add, Clear, Delete, Edit, Save } from "@mui/icons-material";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useCreateGymSession, useDeleteGymSession, useEditGymSession, useGymExerciseTypes } from "../api";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";

const ExerciseTableCell = ({
  exercise,
  searchText,
  isEditing,
  setExercises
}: {
  exercise: GymExercise,
  searchText: string,
  isEditing: boolean,
  setExercises: Dispatch<SetStateAction<GymExercise[]>>
}) => {
  const [weight, setWeight] = useState(exercise.weight);
  const [note, setNote] = useState(exercise.note);

  return (
    <TableCell>
      {!isEditing ?
        <Typography variant="body2">
          <SearchTextHighlight text={weight.toString()} searchText={searchText.trim()} />{" "}kg
          <SearchTextHighlight text={note ? ` (${note})` : ""} searchText={searchText.trim()} />
        </Typography>
        :
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', minWidth: 170 }}>
          <TextField
            variant="standard"
            placeholder="Amount"
            value={weight}
            onChange={(e) => {
              const newWeight = parseFloat(e.target.value);
              setWeight(isNaN(newWeight) ? 0 : newWeight); // Update displayed value
              exercise.weight = isNaN(newWeight) ? 0 : newWeight; // Update the exercise object
            }}
            slotProps={{
              input: {
                endAdornment: <InputAdornment position="end">kg</InputAdornment>,
              }
            }}
          />
          <TextField
            variant="standard"
            placeholder="Note"
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              exercise.note = e.target.value;
            }}
          />
          <IconButton size="small" onClick={() => {
            setExercises(exs => exs.filter((ex) => ex.type.id !== exercise.type.id));
          }}>
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      }
    </TableCell>
  )
}

export const GymSessionTableRow = ({
  session,
  index,
  searchText,
  isAddingSession,
  setIsAddingSession,
}: {
  session: GymSession;
  index: number;
  searchText: string;
  isAddingSession?: boolean;
  setIsAddingSession?: Dispatch<SetStateAction<boolean>>;
}) => {

  const [isEditing, setIsEditing] = useState(isAddingSession ?? false);
  const [date, setDate] = useState(dayjs(session.date));
  const [note, setNote] = useState(session.note);
  const [exercises, setExercises] = useState(session.exercises);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: exerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: true });

  const { mutate: createSession, isPending: createLoading, isSuccess: createSuccess } = useCreateGymSession();
  const { mutate: editSession, isPending: editLoading, isSuccess: editSuccess } = useEditGymSession();
  const { mutate: deleteSession, isPending: deleteLoading } = useDeleteGymSession();

  const save = () => {
    if (!isEditing) return;
    if (!isAddingSession)
      editSession({
        id: session.id,
        date: date.toDate(),
        note: note.trim(),
        exercises
      });
    else if (setIsAddingSession)
      createSession({
        date: date.toDate(),
        note: note.trim(),
        exercises
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess && setIsAddingSession) setIsAddingSession(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Fragment>
      <TableRow
        sx={{
          backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
          ":hover": { backgroundColor: "action.hover" }
        }}
        onDoubleClick={() => setIsEditing(true)}
      >
        <TableCell>
          {!isEditing ? date.format("DD.MM.YYYY") :
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue ?? dayjs())}
                enableAccessibleFieldDOMStructure={false}
                format="DD.MM.YYYY"
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    placeholder: "Date",
                  }
                }}
                sx={{ minWidth: 130 }}
              />
            </LocalizationProvider>
          }
        </TableCell>

        {exerciseTypes?.map((exerciseType, index) => (
          exercises.find((ex) => ex.type.id === exerciseType.id) ?
            <ExerciseTableCell
              key={index}
              exercise={exercises.find((ex) => ex.type.id === exerciseType.id)!}
              searchText={searchText.trim()}
              isEditing={isEditing}
              setExercises={setExercises}
            />
            : <TableCell key={index}>
              {isEditing && <IconButton
                size="small"
                onClick={() => setExercises([...exercises, {
                  id: -1,
                  type: exerciseType,
                  session: {} as any,
                  weight: 0,
                  sets: 0,
                  reps: 0,
                  note: ""
                }])}>
                <Add />
              </IconButton>}
            </TableCell>
        ))}

        <TableCell>
          {!isEditing ?
            <SearchTextHighlight text={note} searchText={searchText.trim()} />
            :
            <TextField
              variant="standard"
              placeholder="Note"
              value={note}
              sx={{ width: "100%" }}
              onChange={(e) => setNote(e.target.value)}
            />
          }
        </TableCell>

        {!isEditing ? (
          <TableCell>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </TableCell>
        ) : (
          <TableCell sx={{ display: 'flex', gap: 1 }}>
            <IconButton
              size="small"
              color="success"
              loading={createLoading || editLoading}
              onClick={save}>
              <Save fontSize="small" />
            </IconButton>

            {!isAddingSession && (
              <IconButton
                size="small"
                color="error"
                loading={deleteLoading}
                onClick={() => setConfirmDeleteOpen(true)}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}

            <IconButton size="small" onClick={() => {
              if (!isAddingSession) {
                setDate(dayjs(session.date));
                setNote(session.note);
                setExercises(session.exercises);
                setIsEditing(false);
              } else if (setIsAddingSession) {
                setIsAddingSession(false);
              }
            }}>
              <Clear fontSize="small" />
            </IconButton>
          </TableCell>
        )}
      </TableRow>
      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`gym session on ${date.format("DD.MM.YYYY")}`}
        deleteFn={() => deleteSession({ id: session.id })}
      />
    </Fragment>
  )
}
