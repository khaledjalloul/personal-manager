import {
  Box,
  Button,
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
import { useExpensesCategories, useExpenses, useIncomes } from "../../../api";
import { ExpensesCategoryCard, ExpenseTableRow, IncomeTableRow } from "../../../components";
import { Add } from "@mui/icons-material";
import { useState } from "react";
import { Expense, ExpensesCategory, Income } from "../../../types";

const emptyIncome: Income = {
  id: -1,
  date: new Date(),
  source: "",
  amount: 0,
}

const emptyCategory: ExpensesCategory = {
  id: -1,
  name: "",
  color: ""
}

const emptyExpense: Expense = {
  id: -1,
  date: new Date(),
  category: emptyCategory,
  description: "",
  vendor: "",
  type: "manual",
  amount: 0,
  tags: [],
}

export const ManageExpenses = ({
  searchText
}: {
  searchText: string;
}) => {

  const { data: manualExpenses } = useExpenses({
    type: "manual",
    tags: [],
    searchText: searchText.trim()
  });

  const { data: incomes } = useIncomes({
    searchText: searchText.trim()
  });

  const { data: categories } = useExpensesCategories()

  const [isAddingIncome, setIsAddingIncome] = useState(false);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  return (
    <Wrapper>
      <Grid container spacing={2}>
        <IncomeGridItem size={{ xs: 12, lg: 5 }} sx={{ maxHeight: '60vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Income</Typography>

            <IconButton size="small" onClick={() => setIsAddingIncome(true)}>
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
                {isAddingIncome && (
                  <IncomeTableRow
                    key={emptyIncome.id}
                    income={{ ...emptyIncome, date: new Date() }}
                    index={emptyIncome.id}
                    isAddingIncome={isAddingIncome}
                    setIsAddingIncome={setIsAddingIncome}
                    editable />
                )}
                {incomes?.map((income, index) => (
                  <IncomeTableRow
                    key={income.id}
                    income={income}
                    index={index}
                    editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </IncomeGridItem>

        <ManualExpensesGridItem size={{ xs: 12, lg: 7 }} sx={{ maxHeight: '60vh' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Manual Expenses</Typography>

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
                    isAddingExpense={isAddingExpense}
                    setIsAddingExpense={setIsAddingExpense}
                    editable />
                )}
                {manualExpenses?.map((expense, index) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    index={index}
                    editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ManualExpensesGridItem>
      </Grid>

      <Typography variant="h6" mt={2}>Import Bank Expenses CSV</Typography>

      <CSVFileUploadWrapper>
        <input
          type="file"
          accept=".csv"
          style={{ display: "none" }}
          id="csv-upload"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              console.log("Selected file:", file.name);
            }
          }}
        />
        <label htmlFor="csv-upload">
          <Button variant="contained" component="span">
            Upload CSV
          </Button>
        </label>
      </CSVFileUploadWrapper>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1, mt: 2 }}>
        <Typography variant="h6">Manage Categories</Typography>
        <IconButton size="small" onClick={() => setIsAddingCategory(true)}>
          <Add />
        </IconButton>
      </Box>

      <Grid container spacing={2}>
        {isAddingCategory && (
          <ExpensesCategoryCard
            key={emptyCategory.id}
            category={emptyCategory}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        )}
        {categories?.map((category) => (
          <ExpensesCategoryCard
            key={category.id}
            category={category}
            isAddingCategory={isAddingCategory}
            setIsAddingCategory={setIsAddingCategory}
          />
        ))}
      </Grid>

    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto; // Idk why but needed to prevent extra scroll
  gap: 16px;
  padding: 32px;
  padding-top: 0;
`;

const IncomeGridItem = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManualExpensesGridItem = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CSVFileUploadWrapper = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  border: solid 1px gray;
  border-radius: 8px;
  padding: 32px;
`;
