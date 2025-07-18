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

  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {expenses?.map((expense, index) => (
            <ExpenseTableRow key={expense.id} index={index} expense={expense} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

