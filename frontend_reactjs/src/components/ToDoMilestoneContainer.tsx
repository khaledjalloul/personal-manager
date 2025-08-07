import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ToDoMilestone, ToDoTask, ToDoTaskStatus } from "../types";
import { useCreateToDoMilestone, useDeleteToDoMilestone, useEditToDoMilestone, useToDoTasks } from "../api";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import { SearchTextHighlight } from "./SearchTextHighlight";
import { ToDoTaskContainer } from "./ToDoTaskContainer";
import { useCtrlS } from "../utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Add, Clear, Delete, Edit, Save } from "@mui/icons-material";
import { ConfirmDeleteDialog } from "./modals";

const emptyTask: ToDoTask = {
  id: -1,
  date: new Date(),
  content: "",
  status: ToDoTaskStatus.Pending
};

export const ToDoMilestoneContainer = ({
  milestone,
  searchText,
  isAddingMilestone,
  setIsAddingMilestone
}: {
  milestone: ToDoMilestone
  searchText: string
  isAddingMilestone: boolean
  setIsAddingMilestone: Dispatch<SetStateAction<boolean>>
}) => {

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(isAddingMilestone);
  const [date, setDate] = useState(milestone.date && dayjs(milestone.date));
  const [description, setDescription] = useState(milestone.description);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const { data: tasks } = useToDoTasks({
    milestoneId: milestone.id,
    isArchived: false,
    searchText: searchText.trim(),
  });

  const { mutate: createMilestone, isPending: createMilestoneLoading, isSuccess: createMilestoneSuccess } = useCreateToDoMilestone();
  const { mutate: editMilestone, isPending: editMilestoneLoading, isSuccess: editMilestoneSuccess } = useEditToDoMilestone();
  const { mutate: deleteMilestone, isPending: deleteMilestoneLoading } = useDeleteToDoMilestone();

  const save = () => {
    if (!isEditing || !description.trim() || !date) return;

    if (isAddingMilestone) {
      createMilestone({
        date: date.toDate(),
        description: description.trim(),
      });
    } else {
      editMilestone({
        id: milestone.id,
        date: date.toDate(),
        description: description.trim(),
      });
    }
  };

  useCtrlS(save);

  useEffect(() => {
    if (createMilestoneSuccess) setIsAddingMilestone(false);
  }, [createMilestoneSuccess]);

  useEffect(() => {
    if (editMilestoneSuccess) setIsEditing(false);
  }, [editMilestoneSuccess]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: isEditing ? 2 : 0.5,
    }}>
      {!isEditing ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>
            {dayjs(milestone.date).format('MMMM DD, YYYY')} ({tasks?.length || 0})
          </Typography>

          {!isAddingMilestone && (
            <IconButton onClick={() => setIsAddingTask(true)}>
              <Add fontSize="small" />
            </IconButton>
          )}

          <IconButton onClick={() => setIsEditing(true)}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={date ?? null}
              onChange={(newValue) => setDate(newValue ?? dayjs(new Date()))}
              enableAccessibleFieldDOMStructure={false}
              format="MMMM DD, YYYY"
              slotProps={{
                textField: {
                  size: "small",
                  variant: "standard",
                  placeholder: "Date",
                }
              }}
              sx={{ alignSelf: 'flex-start' }}
            />
          </LocalizationProvider>

          <IconButton
            onClick={save}
            loading={createMilestoneLoading || editMilestoneLoading}
            disabled={!description.trim() || !date}
            sx={{ ml: 1 }}
            color="success"
          >
            <Save fontSize="small" />
          </IconButton>

          {!isAddingMilestone && (
            <IconButton
              onClick={() => setConfirmDeleteOpen(true)}
              loading={deleteMilestoneLoading}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          )}

          <IconButton
            onClick={() => {
              if (!isAddingMilestone) {
                setDescription(milestone.description);
                setDate(dayjs(milestone.date));
                setIsEditing(false);
              } else {
                setIsAddingMilestone(false);
              }
            }}
          >
            <Clear fontSize="small" />
          </IconButton>
        </Box>
      )}

      {!isEditing ? (
        <Typography variant="h6">
          <SearchTextHighlight text={milestone.description} searchText={searchText} />
        </Typography>
      ) : (
        <TextField
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          variant="standard"
          placeholder="Description"
        />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          mt: 1
        }}
      >
        {isAddingTask && (
          <ToDoTaskContainer
            task={{ ...emptyTask, milestoneId: milestone.id, date: milestone.date }}
            searchText={searchText}
            isAddingTask={isAddingTask}
            setIsAddingTask={setIsAddingTask}
            editable
          />
        )}
        {tasks?.map((task) => (
          <ToDoTaskContainer
            key={task.id}
            task={task}
            searchText={searchText}
            isAddingTask={isAddingTask}
            setIsAddingTask={setIsAddingTask}
            editable
          />
        ))}
      </Box>

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`milestone (and all its tasks): ${milestone.description}`}
        deleteFn={() => deleteMilestone({ id: milestone.id })}
      />
    </Box>
  )
}