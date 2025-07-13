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
import { ExpenseTableRow } from "../../../components";

export const DailyExpenses = () => {
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
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount (CHF)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses?.map((expense, index) => (
              <ExpenseTableRow key={index} index={index} expense={expense} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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

