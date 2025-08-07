import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Add, Clear, Today, ViewList } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

export const ToDoWrapper = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [displayedCount, setDisplayedCount] = useState(0);
  const [isArchived, setisArchived] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [addFunction, setAddFunction] = useState<(() => void)>(() => { });

  const isGeneral = location.pathname === "/todo";

  return (
    <Wrapper>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: 2,
          padding: "0 32px 0 32px"
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: { xs: 0, sm: 1 }, mb: { xs: 1, sm: 0 } }}>
          <Typography variant="h5" sx={{ whiteSpace: 'nowrap' }}>
            To Do ({displayedCount})
          </Typography>

          <IconButton onClick={addFunction}>
            <Add />
          </IconButton>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3,
          flexGrow: 1,
        }}
        >
          <Button
            variant="outlined"
            startIcon={isGeneral ? <Today /> : <ViewList />}
            sx={{ whiteSpace: 'nowrap', flexGrow: { xs: 1, sm: 0 } }}
            onClick={() => navigate(isGeneral ? "/todo/milestones" : "/todo")}
          >
            {isGeneral ? "Milestones" : "General"}
          </Button>

          {isGeneral && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography>Archived</Typography>
              <Switch
                checked={isArchived}
                onChange={(e) => setisArchived(e.target.checked)}
              />
            </Box>
          )}
        </Box>

        <TextField
          sx={{
            ml: { xs: 0, sm: "auto" },
            minWidth: { xs: 0, sm: "35vw" },
          }}
          label="Search to-do tasks"
          placeholder={isGeneral ? "Content" : "Milestone, task"}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          slotProps={{
            input: {
              endAdornment: searchText.length > 0 && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchText("")}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
      </Box>

      <Outlet context={{
        searchText,
        isArchived,
        setDisplayedCount,
        setAddFunction
      }} />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
`;
