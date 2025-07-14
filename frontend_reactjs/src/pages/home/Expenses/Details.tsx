import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import styled from "styled-components";
import { useExpenses } from "../../../api";
import { ExpenseTableRow } from "../../../components";

export const ExpensesDetails = () => {

  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: "", // TODO
  });

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
