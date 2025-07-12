import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Settings, Insights, Clear, Calculate, Today } from "@mui/icons-material";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useExpenses, useIncomes } from "../../../api";
import { ExpenseCard, ExpenseCardHeader } from "../../../components";

export const ExpensesWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Current location:", location.pathname);
  //   const { userData } = useContext(UserContext);

  //   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
  const [searchText, setSearchText] = useState("");
  //   const [modalItem, setModalItem] = useState<Group>();

  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: searchText.trim(),
  });
  // const { data: incomes } = useIncomes({
  //   searchText: searchText.trim(),
  // });

  return (
    <Wrapper>
      <Header>
        {/* <Typography variant="h6">Groups</Typography> */}
        {/* <IconButton onClick={() => navigate("/create")}>
          <Add color="success" />
        </IconButton> */}
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
          onClick={location.pathname === "/expenses/daily" ? undefined : () => navigate("/expenses/daily")}
          color="secondary"
          startIcon={<Today />}
        >
          Daily
        </Button>
        <Button
          variant="contained"
          onClick={location.pathname === "/expenses/totals" ? undefined : () => navigate("/expenses/totals")}
          color="secondary"
          startIcon={<Calculate />}
        >
          Totals
        </Button>
        <Button
          variant="contained"
          onClick={location.pathname === "/expenses/manage" ? undefined : () => navigate("/expenses/manage")}
          color="secondary"
          startIcon={<Settings />}
        >
          Manage
        </Button>
        {/* <TextField
          select
          value={maxUsers}
          label={"Maximum Users"}
          sx={{ ml: "auto", minWidth: 125 }}
          onChange={(item) => setMaxUsers(item.target.value)}
        >
          {maxUsersOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </TextField> */}
        <TextField
          sx={{ minWidth: "35vw", ml: "auto" }}
          label="Search for expense"
          placeholder="Category, description, vendor, tags, etc."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          InputProps={{
            endAdornment: searchText.length > 0 && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setSearchText("")}
                >
                  <Clear />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Header>

      <Outlet />

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
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

const ExpensesScrollWrapper = styled(Box)`
  overflow-y: scroll;
  max-height: 75vh;
  margin-top: -16px;
`;

