import {
  Box,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useExpensesCategories, useExpenses, useFunds } from "../../../api";
import { ExpenseTableRow, FundTableRow } from "../../../components";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Expense, ExpensesCategory, ExpenseType, Fund } from "../../../types";
import { useOutletContext } from "react-router-dom";

const emptyFund: Fund = {
  id: -1,
  date: new Date(),
  source: "",
  amount: 0,
  type: ExpenseType.Bank_Manual
}

const emptyCategory: ExpensesCategory = {
  id: -1,
  name: "",
  color: "",
  keywords: []
}

const emptyExpense: Expense = {
  id: -1,
  date: new Date(),
  category: emptyCategory,
  description: "",
  vendor: "",
  type: ExpenseType.Bank_Manual,
  amount: 0,
  tags: [],
}

export const ManageManualExpenses = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const [isAddingFund, setIsAddingFund] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  const { data: categories } = useExpensesCategories();
  const { data: manualExpenses } = useExpenses({
    types: [ExpenseType.Bank_Manual, ExpenseType.Cash],
    searchText: searchText.trim(),
    filterCategoryIds: [-1] // all
  });
  const { data: manualFunds } = useFunds({
    types: [ExpenseType.Bank_Manual, ExpenseType.Cash],
    searchText: searchText.trim(),
  });

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6">Manual Funds ({manualFunds?.length})</Typography>

        <IconButton size="small" onClick={() => setIsAddingFund(true)}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table
          size="small"
          stickyHeader
          sx={{
            '& th': {
              backgroundColor: "primary.main",
              color: "primary.contrastText"
            }
          }}
        >
          <TableHead>
            <TableRow >
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textWrap: "nowrap" }}>Amount (CHF)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAddingFund && (
              <FundTableRow
                key={emptyFund.id}
                fund={{ ...emptyFund, date: new Date() }}
                index={emptyFund.id}
                searchText={searchText}
                isAddingFund={isAddingFund}
                setIsAddingFund={setIsAddingFund}
                editable />
            )}
            {manualFunds?.map((fund, index) => (
              <FundTableRow
                key={fund.id}
                fund={fund}
                index={index}
                searchText={searchText}
                editable />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 4 }}>
        <Typography variant="h6">Manual Expenses ({manualExpenses?.length})</Typography>

        <IconButton size="small" onClick={() => setIsAddingExpense(true)}>
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper}>
        <Table
          size="small"
          stickyHeader
          sx={{
            '& th': {
              backgroundColor: "primary.main",
              color: "primary.contrastText"
            }
          }}
        >
          <TableHead>
            <TableRow >
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textWrap: "nowrap" }}>Amount (CHF)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isAddingExpense && (
              <ExpenseTableRow
                key={emptyExpense.id}
                expense={{
                  ...emptyExpense,
                  category: categories ? categories[0] : emptyCategory,
                  date: new Date()
                }}
                index={emptyExpense.id}
                searchText={searchText}
                isAddingExpense={isAddingExpense}
                setIsAddingExpense={setIsAddingExpense}
                editable />
            )}
            {manualExpenses?.map((expense, index) => (
              <ExpenseTableRow
                key={expense.id}
                expense={expense}
                index={index}
                searchText={searchText}
                editable />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  padding-top: 0;
`;
