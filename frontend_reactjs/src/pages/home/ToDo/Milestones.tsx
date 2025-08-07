import { Box, Typography, } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToDoMilestones } from "../../../api";
import { ToDoMilestone } from "../../../types";
import { useOutletContext } from "react-router-dom";
import { ToDoMilestoneContainer } from "../../../components/ToDoMilestoneContainer";

const emptyMilestone: ToDoMilestone = {
  id: -1,
  date: new Date(),
  description: "",
};

export const ToDoMilestones = () => {

  const { searchText, setDisplayedCount, setAddFunction } = useOutletContext<{
    searchText: string,
    setDisplayedCount: Dispatch<SetStateAction<number>>,
    setAddFunction: Dispatch<SetStateAction<() => void>>
  }>();

  const [isAddingMilestone, setIsAddingMilestone] = useState(false);

  const { data: toDoMilestones } = useToDoMilestones({
    searchText: searchText.trim(),
  });

  useEffect(() => {
    if (toDoMilestones) {
      setDisplayedCount(toDoMilestones.length);
    }
  }, [toDoMilestones]);

  useEffect(() => {
    setAddFunction(() => () => setIsAddingMilestone(true));
  }, []);

  return (
    <Box sx={{
      overflowY: { xs: 'unset', sm: 'auto' },
      p: '32px',
      pt: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 5
    }}>
      {!isAddingMilestone && toDoMilestones?.length === 0 && (
        <Typography align="center" mt={7}>No milestones.</Typography>
      )}
      {isAddingMilestone && (
        <ToDoMilestoneContainer
          milestone={emptyMilestone}
          searchText={searchText}
          isAddingMilestone={isAddingMilestone}
          setIsAddingMilestone={setIsAddingMilestone}
        />
      )}
      {toDoMilestones?.map((milestone) => (
        <ToDoMilestoneContainer
          key={milestone.id}
          milestone={milestone}
          searchText={searchText}
          isAddingMilestone={isAddingMilestone}
          setIsAddingMilestone={setIsAddingMilestone}
        />
      ))}
    </Box>
  );
};
