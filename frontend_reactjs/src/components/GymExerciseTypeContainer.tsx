import { Box, IconButton, TextField } from "@mui/material";
import { useCreateGymExerciseType, useDeleteGymExerciseType, useEditGymExerciseType } from "../api";
import { useEffect, useState } from "react";
import { GymExerciseType } from "../types";
import { useCtrlS } from "../utils";
import { Add, Delete, Save } from "@mui/icons-material";
import { ConfirmDeleteDialog } from ".";

export const GymExerciseTypeContainer = ({
  exerciseType,
}: {
  exerciseType: GymExerciseType;
}) => {
  const [name, setName] = useState(exerciseType.name);
  const [description, setDescription] = useState(exerciseType.description);

  const { mutate: createExerciseType, isPending: createLoading, isSuccess: createSuccess } = useCreateGymExerciseType();
  const { mutate: editExerciseType, isPending: editLoading } = useEditGymExerciseType();
  const { mutate: deleteExerciseType, isPending: deleteLoading } = useDeleteGymExerciseType();

  const save = () => {
    if (!name.trim() || (name.trim() === exerciseType.name && description === exerciseType.description)) return;
    if (exerciseType.id === -1)
      createExerciseType({
        name: name.trim(),
        description: description.trim()
      });
    else
      editExerciseType({
        id: exerciseType.id,
        name: name.trim(),
        description: description.trim(),
      });
  };

  useCtrlS(save);

  useEffect(() => {
    if (createSuccess) {
      setName("");
      setDescription("");
    }
  }, [createSuccess]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 1,
    }}>
      <TextField
        sx={{ flexGrow: 1 }}
        variant="standard"
        placeholder={exerciseType.id === -1 ? "Add New Name" : "Name"}
        value={name}
        onChange={(e) => setName(e.target.value)} />
      <TextField
        sx={{ flexGrow: 4 }}
        variant="standard"
        placeholder={exerciseType.id === -1 ? "Add New Description" : "Description"}
        value={description}
        onChange={(e) => setDescription(e.target.value)} />
      <IconButton
        size="small"
        color="success"
        loading={createLoading || editLoading}
        onClick={save}
        disabled={!name.trim() || (name.trim() === exerciseType.name && description === exerciseType.description)}
      >
        {exerciseType.id === -1 ? <Add fontSize="small" /> : <Save fontSize="small" />}
      </IconButton>

      <ConfirmDeleteDialog
        itemName={`exercise type: ${exerciseType.name}`}
        deleteFn={() => {
          deleteExerciseType({ id: exerciseType.id });
        }}
      >
        <IconButton
          sx={{ display: exerciseType.id === -1 ? 'none' : 'block' }}
          size="small"
          color="error"
          loading={deleteLoading}
          disabled={(exerciseType._count?.exercises ?? 0) > 0}
        >
          <Delete fontSize="small" />
        </IconButton>
      </ConfirmDeleteDialog>
    </Box>
  )
};
