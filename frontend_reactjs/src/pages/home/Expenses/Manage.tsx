import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import { Settings, Insights, Clear, Man } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useExpenseCategories, useExpenses, useIncomes } from "../../../api";
import { ExpenseCard, ExpenseCardHeader, ExpenseTableRow, IncomeCard, IncomeCardHeader, IncomeTableRow } from "../../../components";

export const ManageExpenses = () => {
  const navigate = useNavigate();
  //   const { userData } = useContext(UserContext);

  //   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
  // const [searchText, setSearchText] = useState("");
  //   const [modalItem, setModalItem] = useState<Group>();

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
        {/* <IncomeCardHeader />
        <IncomeScrollWrapper>
          {incomes?.map((income, index) => (
            <IncomeCard key={index} income={income} index={index} editable />
          ))}
        </IncomeScrollWrapper> */}


        <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
          <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
            <TableHead>
              <TableRow >
                <TableCell>Date</TableCell>
                <TableCell>Source</TableCell>
                <TableCell sx={{ textWrap: "nowrap" }}>Amount (CHF)</TableCell>
                <TableCell>Actions</TableCell>
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
        {/* <ExpenseCardHeader />
        <ManualExpensesScrollWrapper>
          {manualExpenses?.map((expense, index) => (
            <ExpenseCard key={index} expense={expense} index={index} editable />
          ))}
        </ManualExpensesScrollWrapper> */}


        <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
          <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
            <TableHead>
              <TableRow >
                <TableCell>Date</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell sx={{ textWrap: "nowrap" }}>Amount (CHF)</TableCell>
                <TableCell>Actions</TableCell>
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
                // handle file upload logic here
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

// const Header = styled(Box)`
//   display: flex;
//   align-items: center;
//   flex-grow: 1;
//   gap: 8px;
// `;

const Income = styled(Box)`
  flex-grow: 0.3;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const IncomeScrollWrapper = styled(Box)`
  overflow-y: scroll;
  max-height: 75vh;
  margin-top: -16px;
`;

const ManualExpenses = styled(Box)`
  flex-grow: 0.6;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ManualExpensesScrollWrapper = styled(Box)`
  overflow-y: scroll;
  max-height: 75vh;
  margin-top: -16px;
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
