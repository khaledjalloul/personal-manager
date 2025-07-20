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
import { useExpensesCategories, useMonthlyExpenses } from "../../../api";
import dayjs from "dayjs";
import { useOutletContext } from "react-router-dom";

export const MonthlyExpenses = () => {
  const { searchText } = useOutletContext<{ searchText: string }>();

  const { data: expensesCategories } = useExpensesCategories();
  const { data: monthlyExpenses } = useMonthlyExpenses({
    searchText: searchText.trim(),
  });

  if (!monthlyExpenses) return <div />;

  const hasUncategorized = Object.values(monthlyExpenses).some(month => month["Uncategorized"] > 0);

  return (
    <Box sx={{ p: '32px', pt: 0 }}>
      <TableContainer component={Paper} >
        <Table
          size="small"
          sx={{
            '& th': {
              backgroundColor: "primary.main",
              color: "primary.contrastText"
            }
          }}
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
              {hasUncategorized && (
                <TableCell sx={{ fontWeight: 'bold' }}>Uncategorized</TableCell>
              )}
              {expensesCategories?.map((category) => (
                <TableCell sx={{ fontWeight: 'bold' }} key={category.id}>
                  {category.name}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(monthlyExpenses).sort().reverse().map((month, index) => (
              <TableRow
                key={month}
                sx={{
                  backgroundColor: index % 2 === 0 ? "background.default" : "primary.light",
                }}
              >
                <TableCell>
                  {dayjs(month).format("MMMM YYYY")}
                </TableCell>
                {hasUncategorized && (
                  <TableCell>
                    {monthlyExpenses[month]["Uncategorized"].toFixed(2)} CHF
                  </TableCell>
                )}
                {expensesCategories?.map((category) => (
                  <TableCell key={category.id}>
                    {monthlyExpenses[month][category.name].toFixed(2)} CHF
                  </TableCell>
                ))}
                <TableCell>
                  {monthlyExpenses[month].total.toFixed(2)} CHF
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
