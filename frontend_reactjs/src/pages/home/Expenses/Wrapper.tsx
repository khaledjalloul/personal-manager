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
import { NavLink, Outlet, useLocation } from "react-router-dom";

export const ExpensesWrapper = () => {
  const location = useLocation();

  const [searchText, setSearchText] = useState("");

  return (
    <Wrapper>
      <Header>
        <NavLink to="/expenses">
          {({ }) => (
            <Button startIcon={<Insights />} variant={location.pathname === "/expenses" ? "contained" : "outlined"}>
              Statistics
            </Button>
          )}
        </NavLink>

        <NavLink to="/expenses/monthly">
          {({ isActive }) => (
            <Button startIcon={<Today />} variant={isActive ? "contained" : "outlined"}>
              Monthly
            </Button>
          )}
        </NavLink>

        <NavLink to="/expenses/details">
          {({ isActive }) => (
            <Button startIcon={<ViewList />} variant={isActive ? "contained" : "outlined"}>
              Details
            </Button>
          )}
        </NavLink>

        <NavLink to="/expenses/manage">
          {({ isActive }) => (
            <Button startIcon={<Settings />} variant={isActive ? "contained" : "outlined"}>
              Manage
            </Button>
          )}
        </NavLink>

        <TextField
          sx={{
            ml: "auto",
            minWidth: location.pathname !== "/expenses" ? "35vw" : 0,
            opacity: location.pathname !== "/expenses" ? 1 : 0,
          }}
          disabled={location.pathname === "/expenses"}
          label="Search expenses"
          placeholder={
            location.pathname === "/expenses/monthly" ?
              "Month" :
              "Category, description, source, vendor"
          }
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

      <Outlet context={{ searchText }} />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  box-sizing: border-box;
  padding-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 32px 0 32px;
`;
