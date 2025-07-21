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
import { useExpenses, useFunds } from "../../../api";
import { ExpenseTableRow, FundTableRow } from "../../../components";
import { useOutletContext } from "react-router-dom";

export const ExpensesDetails = () => {
  const { searchText, filterCategoryIds } = useOutletContext<{ searchText: string, filterCategoryIds: number[] }>();

  const { data: expenses } = useExpenses({
    type: "all",
    searchText: searchText.trim(),
    filterCategoryIds
  });
  const { data: funds } = useFunds({
    type: "all",
    searchText: searchText.trim(),
  });

  const combinedData = [...expenses ?? [], ...funds ?? []].sort((a, b) => b.date.getTime() - a.date.getTime());

  const tableRows = combinedData.filter(item => {
    return !('source' in item) || filterCategoryIds.includes(-1) || filterCategoryIds.includes(-2);
  }).map((item, index) => {
    if ('source' in item) {
      return <FundTableRow key={`fund-${item.id}`} index={index} fund={item} />;
    } else {
      return <ExpenseTableRow key={`expense-${item.id}`} index={index} expense={item} />;
    }
  });

  return (
    <Box sx={{ p: '32px', pt: 0, display: 'flex', overflowY: 'hidden' }}>
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
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Date ({tableRows.length})</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 'bold', textWrap: 'nowrap' }}>Description / Source</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Vendor</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Amount (CHF)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableRows}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

