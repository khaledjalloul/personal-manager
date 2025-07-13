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
import { useMemo } from "react";
import { useExpenseCategories, useExpenses } from "../../../api";

type MonthlyEntry = {
  [month: string]: {
    [category: string]: number;
    total: number;
  };
}

export const MonthlyExpenses = () => {

  const { data: expensesCategories } = useExpenseCategories();
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
        for (const category of categoryNames) {
          acc[month][category] = 0;
        }
      }

      if (categoryNames.includes(expense.category.name)) {
        acc[month][expense.category.name] += expense.amount;
        acc[month].total += expense.amount;
      }

      return acc;
    }, {}) ?? {};
  }, [JSON.stringify(expenses), JSON.stringify(expensesCategories)]);

  return (
    <Wrapper>
      <TableContainer component={Paper}>
        <Table size="small" >
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Month</TableCell>
              {expensesCategories?.map((category) => (
                <TableCell sx={{ fontWeight: 'bold' }} key={category.id}>
                  {category.name}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(summary).map((month, index) => (
              <TableRow
                key={index}
                sx={{
                  backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
                }}
              >
                <TableCell sx={{ width: '10%' }}>
                  {month}
                </TableCell>
                {expensesCategories?.map((category) => (
                  <TableCell key={category.id} sx={{ width: '10%' }}>
                    {summary[month][category.name].toFixed(2)}
                  </TableCell>
                ))}
                <TableCell sx={{ width: '10%' }}>{summary[month].total.toFixed(2)}</TableCell>
              </TableRow>
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
  gap: 16px;
`;
