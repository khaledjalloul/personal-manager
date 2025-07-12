import {
  Box,
  Button,
  Grid,
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
import * as React from 'react';

import styled from "styled-components";
import { useMemo, useState } from "react";
import { Settings, Insights, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useExpenseCategories, useExpenses } from "../../../api";
import { Expense } from "../../../types";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

type Statistics = {
  totalMonthlyAverage: number;
  totalExpenses: number;
  totalExpensesThisMonth: number;
  categories: {
    [category: string]: {
      monthlyAverage: number;
      total: number;
    };
  }
};


export const ExpensesStatistics = () => {
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

  const statistics = useMemo(() => {
    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const categoryNames = expensesCategories?.map(c => c.name) || [];

    const result: Statistics = { totalMonthlyAverage: 0, totalExpenses: 0, totalExpensesThisMonth: 0, categories: {} };
    result.categories = categoryNames.reduce((acc, category) => {
      acc[category] = { monthlyAverage: 0, total: 0 };
      return acc;
    }, {} as Statistics["categories"]);

    const monthsSet = new Set<string>();

    for (const { date, category, amount } of expenses ?? []) {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsSet.add(month);

      if (!result.categories[category.name]) {
        result.categories[category.name] = { monthlyAverage: 0, total: 0 };
      }

      result.categories[category.name].total += amount;
      result.totalExpenses += amount;

      if (month === thisMonth) {
        result.totalExpensesThisMonth += amount;
      }
    }

    const numMonths = monthsSet.size;

    for (const category in result.categories) {
      result.categories[category].monthlyAverage = result.categories[category].total / numMonths;
      result.totalMonthlyAverage += result.categories[category].monthlyAverage;
    }

    return result;

  }, [JSON.stringify(expenses), JSON.stringify(expensesCategories)]);

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, height: '50vh' }} >

        <Box sx={{ flex: 1, display: 'flex' }}>
          <Grid container spacing={2} flexGrow={1}>

            <Grid item xs={12} sx={{ display: 'flex' }} >
              <Box sx={{ borderRadius: 2, p: 4, backgroundColor: "primary.dark", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} >
                <Typography variant="h6" color="white">
                  Total Balance
                </Typography>
                <Typography variant="h3" color="white">
                  1300.00 CHF
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} lg={6} sx={{ display: 'flex' }} >
              <Box sx={{ borderRadius: 2, p: 4, backgroundColor: "primary.dark", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" color="white">
                  ZKB Balance
                </Typography>
                <Typography variant="h3" color="white">
                  3,732.00 CHF
                </Typography>
              </Box>
            </Grid>


            <Grid item xs={12} lg={6} sx={{ display: 'flex' }} >
              <Box sx={{ borderRadius: 2, p: 4, backgroundColor: "primary.dark", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" color="white">
                  Cash Balance
                </Typography>
                <Typography variant="h3" color="white">
                  300.00 CHF
                </Typography>
              </Box>
            </Grid>


            <Grid item xs={12} lg={6} sx={{ display: 'flex' }}  >
              <Box sx={{ borderRadius: 2, p: 4, backgroundColor: "primary.dark", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" color="white">
                  Total Spent This Month
                </Typography>
                <Typography variant="h3" color="white">
                  {statistics.totalExpensesThisMonth.toFixed(2)} CHF
                </Typography>
              </Box>
            </Grid>


            <Grid item xs={12} lg={6} sx={{ display: 'flex' }} >
              <Box sx={{ borderRadius: 2, p: 4, backgroundColor: "primary.dark", flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" color="white">
                  Average Spendings Per Month
                </Typography>
                <Typography variant="h3" color="white">
                  {statistics.totalMonthlyAverage.toFixed(2)} CHF
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>


        <Box sx={{ flex: 1, pt: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>

          <Typography variant="h5">
            Total Spendings Per Category
          </Typography>

          <Doughnut
            data={{
              labels: expensesCategories?.map(c => c.name),
              datasets: [
                {
                  label: 'Amount (CHF)',
                  data: expensesCategories?.map(c => statistics.categories[c.name]?.total),
                  backgroundColor: expensesCategories?.map(c => c.color),
                }
              ],
            }}
            options={{
              plugins: {
                legend: {
                  position: "right",
                  align: "start",
                  labels:
                  {
                    font:
                    {
                      family: "Poppins, Inter, Segoe UI, sans-serif",
                      size: 18
                    }
                  }
                },
              },
            }} />
        </Box>
      </Box>

      <Typography variant="h5" mt={3}>
        Monthly Statistics
      </Typography>

      <TableContainer component={Paper}>
        <Table size="medium" >
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.light" }}>
              {expensesCategories?.map((category) => (
                <TableCell key={category.id} sx={{ fontWeight: 'bold' }}>
                  {category.name}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow
            // sx={{
            //   backgroundColor: index % 2 === 0 ? "white" : "secondary.main",
            //   ":hover": { backgroundColor: "secondary.dark" }
            // }}
            // onClick={() => navigate(`/expenses/${expense.id}`)}
            >
              {expensesCategories?.map((category) => (
                <TableCell key={category.id}>
                  {statistics.categories[category.name].monthlyAverage.toFixed(2)} CHF
                </TableCell>
              ))}
              <TableCell>{statistics.totalMonthlyAverage.toFixed(2)} CHF</TableCell>
            </TableRow>
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

const Header = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ExpensesScrollWrapper = styled(Box)`
  overflow-y: scroll;
  flex-grow: 0;
  max-height: 75vh;
  margin-top: -16px;
`;

const ExpenseCard = styled(Box)`
  display: flex;
  flex-direction: row;
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  gap: 16px;
`;