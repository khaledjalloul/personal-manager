import {
  Box,
  Button,
  Checkbox,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Settings, Insights, Clear, Today, ViewList } from "@mui/icons-material";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useExpensesCategories } from "../../../api";

export const ExpensesWrapper = () => {
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [filterCategoryIds, setFilterCategoryIds] = useState([-1]);

  const { data: categories } = useExpensesCategories();
  const extraCategories = [
    { id: -1, name: "All Categories" },
    { id: -2, name: "Funds" },
    { id: -3, name: "Uncategorized" },
    ...(categories || [])
  ];

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

        <Select
          value={filterCategoryIds}
          sx={{
            ml: "auto",
            display: location.pathname === "/expenses/details" ? "block" : "none"
          }}
          multiple
          renderValue={(selected) => selected.map(s => extraCategories.find(c => c.id === s)?.name).join(', ')}
          onChange={(e) => {
            var values = (typeof e.target.value === "string") ? (
              e.target.value.split(",").map(Number)
            ) : e.target.value;

            if (values.length === 0 || values.at(-1) === -1)
              values = [-1];
            else
              values = values.filter(v => v !== -1);

            setFilterCategoryIds(values);
          }}
        >
          <MenuItem value={-1}>
            <Checkbox checked={filterCategoryIds.includes(-1)} />
            <ListItemText primary={"All Categories"} />
          </MenuItem>
          <MenuItem value={-2}>
            <Checkbox checked={filterCategoryIds.includes(-2)} />
            <ListItemText primary={"Funds"} />
          </MenuItem>
          <MenuItem value={-3}>
            <Checkbox checked={filterCategoryIds.includes(-3)} />
            <ListItemText primary={"Uncategorized"} />
          </MenuItem>
          {(categories?.map(category => (
            <MenuItem key={category.id} value={category.id}>
              <Checkbox checked={filterCategoryIds.includes(category.id)} />
              <ListItemText primary={category.name} />
            </MenuItem>
          )))}
        </Select>

        <TextField
          sx={{
            ml: location.pathname !== "/expenses/details" ? "auto" : 0,
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

      <Outlet context={{ searchText, filterCategoryIds }} />

    </Wrapper >
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
