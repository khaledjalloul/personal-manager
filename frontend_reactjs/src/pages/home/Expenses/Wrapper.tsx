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
      <Header
        sx={{
          flexDirection: { xs: 'column', lg: 'row' },
          alignItems: { xs: 'stretch', lg: 'center' },
          gap: { xs: 2, lg: 1 }
        }}
      >

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            flexGrow: 1,
            gap: { xs: 2, sm: 1 }
          }}
        >
          <NavLink to="/expenses">
            <Button startIcon={<Insights />} variant={location.pathname === "/expenses" ? "contained" : "outlined"} fullWidth>
              Statistics
            </Button>
          </NavLink>

          <NavLink to="/expenses/monthly">
            {({ isActive }) => (
              <Button startIcon={<Today />} variant={isActive ? "contained" : "outlined"} fullWidth>
                Monthly
              </Button>
            )}
          </NavLink>

          <NavLink to="/expenses/details">
            {({ isActive }) => (
              <Button startIcon={<ViewList />} variant={isActive ? "contained" : "outlined"} fullWidth>
                Details
              </Button>
            )}
          </NavLink>

          <NavLink to="/expenses/manage">
            {({ isActive }) => (
              <Button startIcon={<Settings />} variant={isActive ? "contained" : "outlined"} fullWidth>
                Manage
              </Button>
            )}
          </NavLink>
        </Box>

        <Select
          value={filterCategoryIds}
          sx={{
            ml: { xs: 0, lg: "auto" },
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
            ml: { xs: 0, lg: location.pathname !== "/expenses/details" ? "auto" : 0 },
            minWidth: { xs: 0, lg: location.pathname !== "/expenses" ? "35vw" : 0 },
            opacity: { xs: 1, lg: location.pathname !== "/expenses" ? 1 : 0 },
            display: { xs: location.pathname !== "/expenses" ? 'flex' : 'none', lg: 'flex' }
          }}
          disabled={location.pathname === "/expenses"}
          label="Search expenses"
          placeholder={
            location.pathname === "/expenses/monthly" ? "Month" :
              location.pathname === "/expenses/details" ? "Category, description, source, vendor" :
                "Category, description, source, vendor, keyword"
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
  gap: 24px;
`;

const Header = styled(Box)`
  display: flex;
  padding: 0 32px 0 32px;
`;
