import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Settings, Insights, Clear, Today, ViewList } from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

export const ExpensesWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>
        <Button
          variant="contained"
          onClick={location.pathname === "/expenses" ? undefined : () => navigate("/expenses")}
          color="secondary"
          startIcon={<Insights />}
        >
          Statistics
        </Button>

        <Button
          variant="contained"
          onClick={location.pathname === "/expenses/monthly" ? undefined : () => navigate("/expenses/monthly")}
          color="secondary"
          startIcon={<Today />}
        >
          Monthly
        </Button>

        <Button
          variant="contained"
          onClick={location.pathname === "/expenses/details" ? undefined : () => navigate("/expenses/details")}
          color="secondary"
          startIcon={<ViewList />}
        >
          Details
        </Button>

        <Button
          variant="contained"
          onClick={location.pathname === "/expenses/manage" ? undefined : () => navigate("/expenses/manage")}
          color="secondary"
          startIcon={<Settings />}
        >
          Manage
        </Button>

        <TextField
          sx={{
            ml: "auto",
            minWidth: location.pathname !== "/expenses" ? "35vw" : 0,
            opacity: location.pathname !== "/expenses" ? 1 : 0,
          }}
          disabled={location.pathname === "/expenses"}
          label="Search expenses"
          placeholder="Category, description, vendor, tags, etc."
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
      </Header>

      <Outlet />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;
