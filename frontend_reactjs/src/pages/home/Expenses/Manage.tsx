import {
  Box,
  Button,
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
import { useExpenses, useIncomes } from "../../../api";
import { ExpenseTableRow, IncomeTableRow } from "../../../components";

export const ManageExpenses = () => {

  const { data: manualExpenses } = useExpenses({
    type: "manual",
    tags: [],
    searchText: ""
  });

  const { data: incomes } = useIncomes({
    searchText: ""
  });

  return (
    <Wrapper>
      <Income>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>Income</Typography>

        <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
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
              {incomes?.map((income, index) => (
                <IncomeTableRow key={index} income={income} index={index} editable />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Income>

      <ManualExpenses>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>Manual Expenses</Typography>

        <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
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
              {manualExpenses?.map((expense, index) => (
                <ExpenseTableRow key={index} expense={expense} index={index} editable />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ManualExpenses>

      <CSVImporter>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>Import Bank Expenses CSV</Typography>

        <CSVFileUploader>
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
        </CSVFileUploader>
      </CSVImporter>
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const Income = styled(Box)`
  flex-grow: 0.3;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManualExpenses = styled(Box)`
  flex-grow: 0.6;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CSVImporter = styled(Box)`
  flex-grow: 0.1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const CSVFileUploader = styled(Box)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;
