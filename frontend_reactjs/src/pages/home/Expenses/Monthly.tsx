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
import { useMemo, useState } from "react";
import { Settings, Insights, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useExpenseCategories, useExpenses } from "../../../api";
import { Expense } from "../../../types";

type SummaryEntry = {
  [month: string]: {
    [category: string]: number;
    total: number;
  };
}

export const MonthlyExpenses = () => {
  const navigate = useNavigate();
  //   const { userData } = useContext(UserContext);

  //   const [maxUsers, setMaxUsers] = useState(maxUsersOptions[0]);
  const [searchText, setSearchText] = useState("");
  //   const [modalItem, setModalItem] = useState<Group>();

  const { data: expensesCategories } = useExpenseCategories();
  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: searchText.trim(),
  });
  // const { data: expenses } = useExpenses({
  //   // maxUsers: maxUsers !== "Any" ? maxUsers : undefined,
  //   searchText: searchText.trim(),
  // });

  const summary = useMemo(() => {
    const categoryNames = expensesCategories?.map(c => c.name) || [];

    return expenses?.reduce<SummaryEntry>((acc, expense) => {
      const month = `${expense.date.getFullYear()}-${String(expense.date.getMonth() + 1).padStart(2, '0')}`;

      // Init month if not there
      if (!acc[month]) {
        acc[month] = { total: 0 };
        for (const category of categoryNames) {
          acc[month][category] = 0;
        }
      }

      // Add expense to correct category
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
              // onClick={() => navigate(`/expenses/${expense.id}`)}
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
  /* padding: 32px; */
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
