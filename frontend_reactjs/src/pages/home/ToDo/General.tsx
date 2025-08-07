import { Box, Typography, } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToDoTasks } from "../../../api";
import { ToDoTaskContainer } from "../../../components";
import { ToDoTask, ToDoTaskStatus } from "../../../types";
import { useOutletContext } from "react-router-dom";

const emptyTask: ToDoTask = {
  id: -1,
  date: new Date(),
  content: "",
  status: ToDoTaskStatus.Pending
};

export const GeneralToDo = () => {

  const { searchText, isArchived, setDisplayedCount, setAddFunction } = useOutletContext<{
    searchText: string,
    isArchived: boolean,
    setDisplayedCount: Dispatch<SetStateAction<number>>,
    setAddFunction: Dispatch<SetStateAction<() => void>>
  }>();

  const [isAddingTask, setIsAddingTask] = useState(false);

  const { data: toDoTasks } = useToDoTasks({
    isArchived,
    searchText: searchText.trim(),
  });

  useEffect(() => {
    if (toDoTasks) {
      setDisplayedCount(toDoTasks.length);
    }
  }, [toDoTasks]);

  useEffect(() => {
    setAddFunction(() => () => setIsAddingTask(true))
  }, []);

  return (
    <Box sx={{
      overflowY: { xs: 'unset', sm: 'auto' },
      p: '32px',
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    }}>
      {!isAddingTask && toDoTasks?.length === 0 && (
        <Typography align="center" mt={7}>No tasks found.</Typography>
      )}
      {isAddingTask && (
        <ToDoTaskContainer
          task={emptyTask}
          searchText={searchText}
          isAddingTask={true}
          setIsAddingTask={setIsAddingTask}
        />
      )}
      {toDoTasks?.map((task) => (
        <ToDoTaskContainer
          key={task.id}
          task={task}
          searchText={searchText}
          isAddingTask={isAddingTask}
          setIsAddingTask={setIsAddingTask}
        />
      ))}
    </Box>
  );
};
