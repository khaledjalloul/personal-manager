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
import { useNavigate, useLocation } from "react-router-dom";
import { ExpensesStatistics } from "./Statistics";
import { MonthlyExpenses } from "./Monthly";
import { ExpensesDetails } from "./Details";
import { ManageExpenses } from "./Manage";

const enum ExpensesPage {
  Statistics,
  Monthly,
  Details,
  Manage
};

export const ExpensesWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<ExpensesPage>(ExpensesPage.Statistics);

  return (
    <Wrapper>
      <Header>
        <Button
          variant="contained"
          onClick={page === ExpensesPage.Statistics ? undefined : () => setPage(ExpensesPage.Statistics)}
          color="secondary"
          startIcon={<Insights />}
        >
          Statistics
        </Button>

        <Button
          variant="contained"
          onClick={page === ExpensesPage.Monthly ? undefined : () => setPage(ExpensesPage.Monthly)}
          color="secondary"
          startIcon={<Today />}
        >
          Monthly
        </Button>

        <Button
          variant="contained"
          onClick={page === ExpensesPage.Details ? undefined : () => setPage(ExpensesPage.Details)}
          color="secondary"
          startIcon={<ViewList />}
        >
          Details
        </Button>

        <Button
          variant="contained"
          onClick={page === ExpensesPage.Manage ? undefined : () => setPage(ExpensesPage.Manage)}
          color="secondary"
          startIcon={<Settings />}
        >
          Manage
        </Button>

        <TextField
          sx={{
            ml: "auto",
            minWidth: page !== ExpensesPage.Statistics ? "35vw" : 0,
            opacity: page !== ExpensesPage.Statistics ? 1 : 0,
          }}
          disabled={page === ExpensesPage.Statistics}
          label="Search expenses"
          placeholder={
            page === ExpensesPage.Monthly ?
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

      {page === ExpensesPage.Statistics && (
        <ExpensesStatistics />
      )}
      {page === ExpensesPage.Monthly && (
        <MonthlyExpenses searchText={searchText} />
      )}
      {page === ExpensesPage.Details && (
        <ExpensesDetails searchText={searchText} />
      )}
      {page === ExpensesPage.Manage && (
        <ManageExpenses searchText={searchText} />
      )}

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
