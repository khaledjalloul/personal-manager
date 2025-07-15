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
import { CategoryKeywordManager, ExpenseTableRow, IncomeTableRow } from "../../../components";
import { Add } from "@mui/icons-material";

export const ManageExpenses = () => {

  const { data: manualExpenses } = useExpenses({
    type: "manual",
    tags: [],
    searchText: ""
  });
  const sortedManualExpenses = manualExpenses?.sort((a, b) => b.date.getTime() - a.date.getTime());

  const { data: incomes } = useIncomes({
    searchText: ""
  });
  const sortedIncomes = incomes?.sort((a, b) => b.date.getTime() - a.date.getTime());

  const { data: categories } = useExpensesCategories()

  return (
    <Wrapper>
      <Grid container spacing={2} sx={{ maxHeight: '60vh' }}>
        <Income size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Income</Typography>

            <IconButton size="small">
              <Add />
            </IconButton>
          </Box>

          <TableContainer component={Paper}>
            <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
              <TableHead>
                <TableRow >
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Source</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textWrap: "nowrap" }}>Amount (CHF)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedIncomes?.map((income, index) => (
                  <IncomeTableRow key={income.id} income={income} index={index} editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Income>

        <ManualExpenses size={{ xs: 12, md: 8 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6">Manual Expenses</Typography>

            <IconButton size="small">
              <Add />
            </IconButton>
          </Box>

          <TableContainer component={Paper}>
            <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
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
                {sortedManualExpenses?.map((expense, index) => (
                  <ExpenseTableRow key={expense.id} expense={expense} index={index} editable />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </ManualExpenses>
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

      <Typography variant="h6" mt={2}>Manage Category Keywords</Typography>

      <Grid container spacing={2}>
        {categories?.map((category) => (
          <CategoryKeywordManager key={category.id} category={category} />
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
`;

const Income = styled(Grid)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManualExpenses = styled(Grid)`
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
