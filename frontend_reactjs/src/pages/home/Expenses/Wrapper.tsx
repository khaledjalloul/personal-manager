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

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState<ExpensesPage>(ExpensesPage.Statistics);

  return (
    <Wrapper>
      <Header>
        <Button
          variant={page === ExpensesPage.Statistics ? "contained" : "outlined"}
          onClick={page === ExpensesPage.Statistics ? undefined : () => setPage(ExpensesPage.Statistics)}
          startIcon={<Insights />}
        >
          Statistics
        </Button>

        <Button
          variant={page === ExpensesPage.Monthly ? "contained" : "outlined"}
          onClick={page === ExpensesPage.Monthly ? undefined : () => setPage(ExpensesPage.Monthly)}
          startIcon={<Today />}
        >
          Monthly
        </Button>

        <Button
          variant={page === ExpensesPage.Details ? "contained" : "outlined"}
          onClick={page === ExpensesPage.Details ? undefined : () => setPage(ExpensesPage.Details)}
          startIcon={<ViewList />}
        >
          Details
        </Button>

        <Button
          variant={page === ExpensesPage.Manage ? "contained" : "outlined"}
          onClick={page === ExpensesPage.Manage ? undefined : () => setPage(ExpensesPage.Manage)}
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
