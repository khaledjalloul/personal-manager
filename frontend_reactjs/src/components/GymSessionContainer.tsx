import { Box, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import { GymExercise, GymExerciseType, GymSession } from "../types";
import { Add, Chat, Clear, Delete, Edit, LocationPin, Numbers, Save, Today } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { useCreateGymSession, useDeleteGymSession, useEditGymSession, useGymExerciseTypes } from "../api";
import { ConfirmDeleteDialog } from "./modals";
import { useCtrlS } from "../utils";
import { SearchTextHighlight } from "./SearchTextHighlight";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import styled, { DefaultTheme, keyframes } from "styled-components";

const emptyType: GymExerciseType = {
  id: -1,
  name: "",
  description: ""
}

const Exercise = ({
  exercise,
  usedExerciseTypeIds,
  searchText,
  isEditing,
}: {
  exercise: GymExercise,
  usedExerciseTypeIds: number[],
  searchText: string,
  isEditing: boolean,
}) => {
  const [type, setType] = useState(exercise.type);
  const [sets, setSets] = useState(exercise.sets);
  const [reps, setReps] = useState(exercise.reps);
  const [weight, setWeight] = useState(exercise.weight);
  const [note, setNote] = useState(exercise.note);
  const [editable, setEditable] = useState(true);

  const { data: exerciseTypes } = useGymExerciseTypes({ searchText: searchText.trim(), searchInGymSessions: true });

  return (
    <Box sx={{
      display: type.id !== -1 || isEditing ? "flex" : "none",
      flexDirection: "column",
      border: "solid 1px",
      borderColor: "grey.700",
      backgroundColor: "primary.light",
      borderRadius: 2,
      paddingX: 2,
      paddingY: 1,
      gap: 1
    }}>
      {!isEditing ? (
        <Typography sx={{ textAlign: 'center', textWrap: 'nowrap' }}>
          <SearchTextHighlight text={exercise.type.name} searchText={searchText.trim()} />
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <Select
            variant="standard"
            size="small"
            value={type.id}
            disabled={!editable}
            sx={{ minWidth: 130, flexGrow: 1 }}
            onChange={(e) => {
              const newType = exerciseTypes?.find((type) => type.id === e.target.value) ?? exercise.type
              setType(newType);
              exercise.type = newType;
            }}
          >
            {exerciseTypes?.filter((exerciseType) => type.id === exerciseType.id || !usedExerciseTypeIds.includes(exerciseType.id)).map((exerciseType) => (
              <MenuItem key={exerciseType.id} value={exerciseType.id}>
                {exerciseType.name}
              </MenuItem>
            ))}
          </Select>

          <IconButton
            size="small"
            color="error"
            disabled={!editable}
            onClick={() => {
              setType(emptyType);
              exercise.type = emptyType;
              setSets(0);
              exercise.sets = 0;
              setReps(0);
              exercise.reps = 0;
              setWeight(0);
              exercise.weight = 0;
              setNote("");
              exercise.note = "";
              setEditable(false);
            }}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      )}
      <Box sx={{ display: "flex", flexDirection: 'row', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: "flex", flexDirection: "column", }}>
          <Typography variant="caption" sx={{ color: "grey.300" }}>Sets</Typography>
          {!isEditing ? (
            <Typography>{sets}</Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Sets"
              value={sets}
              disabled={!editable}
              onChange={(e) => {
                const newSets = parseFloat(e.target.value);
                setSets(isNaN(newSets) ? 0 : newSets); // Update displayed value
                exercise.sets = isNaN(newSets) ? 0 : newSets; // Update the exercise object
              }}
              style={{ minWidth: 60, maxWidth: 60 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ color: "grey.300" }}>Reps</Typography>
          {!isEditing ? (
            <Typography>{reps}</Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Reps"
              value={reps}
              disabled={!editable}
              onChange={(e) => {
                const newReps = parseFloat(e.target.value);
                setReps(isNaN(newReps) ? 0 : newReps); // Update displayed value
                exercise.reps = isNaN(newReps) ? 0 : newReps; // Update the exercise object
              }}
              style={{ minWidth: 60, maxWidth: 60 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography variant="caption" sx={{ color: "grey.300" }}>Weight</Typography>
          {!isEditing ? (
            <Typography>{weight} kg</Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Weight"
              value={weight}
              disabled={!editable}
              onChange={(e) => {
                const newWeight = parseFloat(e.target.value);
                setWeight(isNaN(newWeight) ? 0 : newWeight); // Update displayed value
                exercise.weight = isNaN(newWeight) ? 0 : newWeight; // Update the exercise object
              }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end" style={{ padding: 0, margin: 0, marginLeft: 2 }}>kg</InputAdornment>,
                }
              }}
              style={{ minWidth: 70, maxWidth: 70 }}
            />
          )}
        </Box>
      </Box>

      <Box sx={{ display: note.trim() || isEditing ? 'flex' : 'none', flexDirection: 'column' }}>
        <Typography variant="caption" sx={{ color: "grey.300" }}>Note</Typography>
        {!isEditing ? (<Typography variant="body2">
          <SearchTextHighlight text={exercise.note} searchText={searchText.trim()} />
        </Typography>
        ) : (
          <TextField
            variant="standard"
            placeholder="Note"
            value={note}
            disabled={!editable}
            onChange={(e) => {
              setNote(e.target.value);
              exercise.note = e.target.value;
            }}
          />
        )}
      </Box>

    </Box>
  )
};

export const GymSessionContainer = ({
  session,
  searchText,
  highlightedId,
  isAddingSession,
  setIsAddingSession,
}: {
  session: GymSession;
  searchText: string;
  highlightedId?: number;
  isAddingSession?: boolean;
  setIsAddingSession?: Dispatch<SetStateAction<boolean>>;
}) => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(isAddingSession ?? false);
  const [date, setDate] = useState(dayjs(session.date));
  const [location, setLocation] = useState(session.location);
  const [note, setNote] = useState(session.note);
  const [exercises, setExercises] = useState(session.exercises);

  const isHighlighted = highlightedId === session.id;

  const { mutate: createSession, isPending: createLoading, isSuccess: createSuccess } = useCreateGymSession();
  const { mutate: editSession, isPending: editLoading, isSuccess: editSuccess } = useEditGymSession();
  const { mutate: deleteSession, isPending: deleteLoading } = useDeleteGymSession();

  const save = () => {
    if (!isEditing) return;
    if (!isAddingSession)
      editSession({
        id: session.id,
        date: date.toDate(),
        location: location.trim(),
        note: note.trim(),
        exercises: exercises.filter((ex) => ex.type.id !== -1)
      });
    else if (setIsAddingSession)
      createSession({
        date: date.toDate(),
        location: location.trim(),
        note: note.trim(),
        exercises: exercises.filter((ex) => ex.type.id !== -1)
      });
  };

  useCtrlS(save);

  const sessionRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (isHighlighted)
      sessionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [isHighlighted]);


  useEffect(() => {
    if (createSuccess && setIsAddingSession) setIsAddingSession(false);
  }, [createSuccess]);

  useEffect(() => {
    if (editSuccess) setIsEditing(false);
  }, [editSuccess]);

  return (
    <Wrapper
      ref={sessionRef}
      isHightlighted={isHighlighted}
      onDoubleClick={() => setIsEditing(true)}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        columnGap: 4,
        rowGap: 1,
        flexWrap: 'wrap',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Today fontSize="small" sx={{ color: "text.primary" }} />
          {!isEditing ?
            <Typography
              sx={{ width: 'fit-content', cursor: 'pointer', ":hover": { textDecoration: 'underline' } }}
              onClick={() => navigate("/calendar", { state: { routedDate: session.date } })}>
              {date.format("DD.MM.YYYY hh:mm A")}
            </Typography>
            :
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newValue) => setDate(newValue ?? dayjs())}
                enableAccessibleFieldDOMStructure={false}
                format="DD.MM.YYYY hh:mm A"
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    placeholder: "Date",
                  }
                }}
                sx={{ minWidth: 200, maxWidth: 200 }}
              />
            </LocalizationProvider>
          }
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationPin fontSize="small" sx={{ color: "text.primary" }} />
          {!isEditing ? (
            <Typography>
              <SearchTextHighlight text={location} searchText={searchText.trim()} />
            </Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Numbers fontSize="small" sx={{ color: "text.primary" }} />
          <Typography>{session.exercises.length} exercises</Typography>
        </Box>

        <Box sx={{ display: note.trim() || isEditing ? 'flex' : 'none', alignItems: 'center', gap: 1 }}>
          <Chat fontSize="small" sx={{ color: "text.primary" }} />
          {!isEditing ? (
            <Typography>
              <SearchTextHighlight text={note} searchText={searchText.trim()} />
            </Typography>
          ) : (
            <TextField
              variant="standard"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          )}
        </Box>

        {!isEditing ? (
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
              size="small"
              onClick={() => setIsEditing(true)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ marginLeft: 'auto' }}>
            <IconButton
              size="small"
              color="success"
              loading={createLoading || editLoading}
              onClick={save}>
              <Save fontSize="small" />
            </IconButton>

            {!isAddingSession && (
              <ConfirmDeleteDialog
                itemName={`gym session on ${date.format("DD.MM.YYYY")}`}
                deleteFn={() => deleteSession({ id: session.id })}
              >
                <IconButton
                  size="small"
                  color="error"
                  loading={deleteLoading}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </ConfirmDeleteDialog>
            )}

            <IconButton size="small" onClick={() => {
              if (!isAddingSession) {
                setDate(dayjs(session.date));
                setLocation(session.location);
                setNote(session.note);
                setExercises(session.exercises);
                setIsEditing(false);
              } else if (setIsAddingSession) {
                setIsAddingSession(false);
              }
            }}>
              <Clear fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
        {exercises.map((exercise, index) => (
          <Exercise
            key={index}
            exercise={exercise}
            usedExerciseTypeIds={exercises.map(e => e.type.id)}
            isEditing={isEditing}
            searchText={searchText}
          />
        ))}
        {isEditing && <Box
          sx={{
            backgroundColor: "primary.light",
            border: "solid 1px",
            borderColor: "grey.700",
            borderRadius: 2,
            p: 2,
            minWidth: 70,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "action.hover"
            }
          }}
          onClick={() => setExercises([...exercises, {
            id: -1,
            type: emptyType,
            session: {} as any,
            weight: 0,
            sets: 0,
            reps: 0,
            note: ""
          }])}
        >
          <Add sx={{ color: "text.primary" }} />
        </Box>}
      </Box>
    </Wrapper >
  )
}

const highlightAnimation = ({ theme }: { theme: DefaultTheme }) => keyframes`
  0% {
    background-color: ${theme.palette.warning.dark};
  }
  100% {
    background-color: ${theme.palette.primary.light};
  }
`;

const Wrapper = styled(Box) <{ isHightlighted: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-bottom: solid 1px;
  border-color: ${({ theme }) => theme.palette.grey[700]};
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 32px;
  padding-right: 32px;
  animation-name: ${({ isHightlighted }) => (isHightlighted ? highlightAnimation : 'none')};
  animation-duration: 3s;
`;
