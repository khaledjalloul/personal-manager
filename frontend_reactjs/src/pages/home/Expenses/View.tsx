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
import { Settings, Insights, Clear, Calculate, Today } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useExpenses, useIncomes } from "../../../api";
import { ExpenseCard, ExpenseCardHeader, ExpenseTableRow } from "../../../components";

export const ViewExpenses = () => {
  const navigate = useNavigate();
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


      <TableContainer component={Paper} sx={{ maxHeight: '75vh' }}>
        <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
          <TableHead>
            <TableRow >
              <TableCell>Date</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Amount (CHF)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((expense, index) => (
              <ExpenseTableRow key={index} index={index} expense={expense} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* 
      <ExpenseCardHeader />

      <ExpensesScrollWrapper>
        {expenses && expenses.length > 0 && expenses.map((expense, index) => (
          <ExpenseCard key={index} index={index} expense={expense} />
        ))}
      </ExpensesScrollWrapper>

      {expenses && expenses.length === 0 && (
        <Typography textAlign={"center"} mt={10}>
          There are no current expenses that match your search.
        </Typography>
      )}

      <GroupModal group={modalItem} setGroup={setModalItem} /> */}
    </Wrapper>
  );
};

const Wrapper = styled(Box)`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ExpensesScrollWrapper = styled(Box)`
  overflow-y: scroll;
  max-height: 75vh;
`;

