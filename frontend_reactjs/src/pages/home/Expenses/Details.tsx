import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useExpenses } from "../../../api";
import { ExpenseTableRow } from "../../../components";

export const ExpensesDetails = () => {

  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: "", // TODO
  });
  const sortedExpenses = expenses?.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <TableContainer component={Paper}>
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
          {sortedExpenses?.map((expense, index) => (
            <ExpenseTableRow key={expense.id} index={index} expense={expense} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

