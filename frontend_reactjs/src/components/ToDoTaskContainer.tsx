import { Box, IconButton, TextField, Typography } from "@mui/material"
import { ToDoTask, ToDoTaskStatus } from "../types";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { CheckBox, CheckBoxOutlineBlank, Clear, Delete, DisabledByDefault, Edit, KeyboardDoubleArrowRight, Save } from "@mui/icons-material";
import { SearchTextHighlight } from "./SearchTextHighlight";
import { useCreateToDoTask, useDeleteToDoTask, useEditToDoTask } from "../api";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useCtrlS } from "../utils";
import { ConfirmDeleteDialog } from "./modals";

export const ToDoTaskContainer = ({
  task,
  searchText,
  isAddingTask,
  setIsAddingTask,
  editable = false
}: {
  task: ToDoTask,
  searchText: string;
  isAddingTask: boolean;
  setIsAddingTask: Dispatch<SetStateAction<boolean>>;
  editable?: boolean;
}) => {

  const [date, setDate] = useState(task.dateModified && dayjs(task.dateModified));
  const [content, setContent] = useState(task.content);
  const [status, setStatus] = useState(task.status);
  const [isEditing, setIsEditing] = useState(isAddingTask);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const statusRef = useRef<ToDoTaskStatus>(task.status);

  const { mutate: createTask, isPending: createTaskLoading, isSuccess: createTaskSuccess } = useCreateToDoTask();
  const { mutate: editTask, isPending: editTaskLoading, isSuccess: editTaskSuccess } = useEditToDoTask();
  const { mutate: deleteTask, isPending: deleteTaskLoading } = useDeleteToDoTask();

  const save = () => {
    if (!editable || !isEditing || !content.trim() || !date) return;

    if (isAddingTask) {
      createTask({
        content: content.trim(),
        date: date?.toDate(),
        milestoneId: task.milestoneId,
      });
    } else {
      editTask({
        id: task.id,
        content: content.trim(),
        date: date?.toDate(),
      });
    }
  };

  useCtrlS(save);

  useEffect(() => {
    if (createTaskSuccess) setIsAddingTask(false);
  }, [createTaskSuccess]);

  useEffect(() => {
    if (editTaskSuccess) setIsEditing(false);
  }, [editTaskSuccess]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: !task.milestoneId ? 'column' : 'row', sm: 'row' },
        alignItems: { xs: !task.milestoneId ? 'stretch' : 'center', sm: 'center' },
        gap: 1,
        flexGrow: 1,
      }}
      onDoubleClick={editable ? () => setIsEditing(true) : undefined}
    >

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!isEditing && (
          <IconButton
            loading={editTaskLoading}
            onClick={() => {
              let newStatus = status;
              switch (status) {
                case ToDoTaskStatus.Pending:
                  newStatus = ToDoTaskStatus.Completed;
                  break;
                case ToDoTaskStatus.Completed:
                  newStatus = ToDoTaskStatus.NotCompleted;
                  break;
                case ToDoTaskStatus.NotCompleted:
                  newStatus = ToDoTaskStatus.Pending;
                  break;
              }
              statusRef.current = newStatus;
              setStatus(newStatus);

              setTimeout(() => {
                if (newStatus === statusRef.current && newStatus != task.status)
                  editTask({ id: task.id, status: newStatus, date: new Date() });
              }, 3000);
            }}
          >
            {status === ToDoTaskStatus.Completed ? (
              <CheckBox color="success" />
            ) : status === ToDoTaskStatus.NotCompleted ? (
              <DisabledByDefault color="error" />
            ) : (
              <CheckBoxOutlineBlank color="action" />
            )}
          </IconButton>
        )
        }

        {editable && (
          !isEditing ? (
            <IconButton onClick={() => setIsEditing(true)}>
              <Edit fontSize="small" />
            </IconButton>
          ) : (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <IconButton
                onClick={save}
                loading={createTaskLoading || editTaskLoading}
                disabled={!content.trim() || !date}
                color="success"
              >
                <Save fontSize="small" />
              </IconButton>

              {!isAddingTask && (
                <IconButton
                  onClick={() => setConfirmDeleteOpen(true)}
                  loading={deleteTaskLoading}
                  color="error"
                >
                  <Delete fontSize="small" />
                </IconButton>
              )}

              <IconButton onClick={() => {
                if (!isAddingTask) {
                  setContent(task.content);
                  setStatus(task.status);
                  setIsEditing(false);
                } else {
                  setIsAddingTask(false);
                }
              }}>
                <Clear fontSize="small" />
              </IconButton>
            </Box>
          )
        )}

        {!task.milestoneId && !isEditing && task.status !== ToDoTaskStatus.Pending && (
          <Box
            sx={{
              border: 'solid 1px',
              borderColor: 'grey.700',
              borderRadius: 2,
              p: 1,
              pl: 2,
              pr: 2,
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              {dayjs(task.dateCreated).format("DD.MM.YYYY")}
            </Typography>
          </Box>
        )}

        {!task.milestoneId && !isEditing && task.status !== ToDoTaskStatus.Pending && (
          <KeyboardDoubleArrowRight sx={{ color: "text.primary" }} />
        )}

        {!task.milestoneId && (
          !isEditing ? (
            <Box
              sx={{
                border: 'solid 1px',
                borderColor: 'grey.700',
                borderRadius: 2,
                flexGrow: 1,
                p: 1,
                pl: 2,
                pr: 2,
                mr: { xs: !task.milestoneId ? 0 : 1, sm: 1 },
                ml: 1
              }}
            >
              <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                {date.format(task.status === ToDoTaskStatus.Pending ? "MMM DD" : "DD.MM.YYYY")}
              </Typography>
            </Box>
          ) : (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date ?? null}
                onChange={(newValue) => setDate(newValue ?? dayjs())}
                enableAccessibleFieldDOMStructure={false}
                format="MMM DD"
                slotProps={{
                  textField: {
                    size: "small",
                    placeholder: "Date",
                  }
                }}
                sx={{
                  mr: { xs: !task.milestoneId ? 0 : 1, sm: 1 },
                  ml: 1,
                  flexGrow: 1
                }}
              />
            </LocalizationProvider>
          )
        )}
      </Box>

      {
        !isEditing ? (
          <Typography>
            <SearchTextHighlight text={content} searchText={searchText.trim()} />
          </Typography>
        ) : (
          <TextField
            value={content}
            onChange={(e) => setContent(e.target.value)}
            variant="standard"
            size="small"
            placeholder="Task Content"
            sx={{ flexGrow: 1 }}
          />
        )
      }

      <ConfirmDeleteDialog
        isOpen={confirmDeleteOpen}
        setIsOpen={setConfirmDeleteOpen}
        itemName={`task: ${task.content}`}
        deleteFn={() => deleteTask({ id: task.id })}
      />
    </Box>
  )
};