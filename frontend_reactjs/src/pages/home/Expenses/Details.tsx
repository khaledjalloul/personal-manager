import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useExpenses, useIncomes } from "../../../api";
import { ExpenseTableRow, IncomeTableRow } from "../../../components";

export const ExpensesDetails = ({
  searchText
}: {
  searchText: string;
}) => {

  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: searchText.trim(),
  });
  const { data: incomes } = useIncomes({
    searchText: searchText.trim(),
  });

  const combinedData = [...expenses ?? [], ...incomes ?? []].sort((a, b) => b.date.getTime() - a.date.getTime());

  const tableRows = combinedData.map((item, index) => {
    if ('source' in item) {
      return <IncomeTableRow key={item.id} index={index} income={item} />;
    } else {
      return <ExpenseTableRow key={item.id} index={index} expense={item} />;
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader sx={{ '& th': { backgroundColor: "primary.light" } }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
            <TableCell sx={{ fontWeight: 'bold', textWrap: 'nowrap' }}>Description / Source</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRows}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

