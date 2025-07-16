import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMemo } from "react";
import { useExpensesCategories, useExpenses } from "../../../api";
import dayjs from "dayjs";

type MonthlyEntry = {
  [month: string]: {
    [category: string]: number;
    total: number;
  };
}

export const MonthlyExpenses = () => {

  const { data: expensesCategories } = useExpensesCategories();
  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: "", // TODO
  });

  const summary = useMemo(() => {
    const categoryNames = expensesCategories?.map(c => c.name) || [];

    return expenses?.reduce<MonthlyEntry>((acc, expense) => {
      const month = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;

      if (!acc[month]) {
        acc[month] = { total: 0 };
        acc[month]["Uncategorized"] = 0;
        for (const category of categoryNames) {
          acc[month][category] = 0;
        }
      }

      if (expense.category)
        acc[month][expense.category.name] += expense.amount;
      else
        acc[month]["Uncategorized"] += expense.amount;

      acc[month].total += expense.amount;

      return acc;
    }, {}) ?? {};
  }, [JSON.stringify(expenses), JSON.stringify(expensesCategories)]);

  const hasUncategorized = Object.values(summary).some(month => month["Uncategorized"] > 0);

  return (
    <TableContainer component={Paper}>
      <Table size="small" >
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
          {Object.keys(summary).sort().reverse().map((month, index) => (
            <TableRow
              key={month}
              sx={{
                backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
              }}
            >
              <TableCell>
                {dayjs(month).format("MMMM YYYY")}
              </TableCell>
              {hasUncategorized && (
                <TableCell>
                  {summary[month]["Uncategorized"].toFixed(2)} CHF
                </TableCell>
              )}
              {expensesCategories?.map((category) => (
                <TableCell key={category.id}>
                  {summary[month][category.name].toFixed(2)} CHF
                </TableCell>
              ))}
              <TableCell>
                {summary[month].total.toFixed(2)} CHF
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
