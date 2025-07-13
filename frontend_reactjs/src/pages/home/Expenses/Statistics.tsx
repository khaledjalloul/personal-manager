import {
  Box,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import styled from "styled-components";
import { useMemo, useState } from "react";
import { useExpenseCategories, useExpenses, useIncomes } from "../../../api";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

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
  months: {
    [month: string]: {
      expenses: number;
      incomes: number;
    }
  }
};


export const ExpensesStatistics = () => {
  const { palette } = useTheme();

  const [overTimeType, setOverTimeType] = useState("both");

  const { data: expensesCategories } = useExpenseCategories();
  const { data: expenses } = useExpenses({
    type: "all",
    tags: [],
    searchText: "",
  });
  const { data: incomes } = useIncomes({
    searchText: "",
  })

  const statistics = useMemo(() => {
    const today = new Date();
    const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    const categoryNames = expensesCategories?.map(c => c.name) || [];

    const result: Statistics = {
      totalMonthlyAverage: 0,
      totalExpenses: 0,
      totalExpensesThisMonth: 0,
      categories: {},
      months: {}
    };

    result.categories = categoryNames.reduce((acc, category) => {
      acc[category] = { monthlyAverage: 0, total: 0 };
      return acc;
    }, {} as Statistics["categories"]);

    for (const { date, category, amount } of expenses ?? []) {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!result.categories[category.name]) {
        result.categories[category.name] = { monthlyAverage: 0, total: 0 };
      }

      if (!result.months[month]) {
        result.months[month] = { expenses: 0, incomes: 0 };
      }

      result.categories[category.name].total += amount;
      result.months[month].expenses += amount;
      result.totalExpenses += amount;

      if (month === thisMonth) {
        result.totalExpensesThisMonth += amount;
      }
    }

    for (const { date, amount } of incomes ?? []) {
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!result.months[month]) {
        result.months[month] = { expenses: 0, incomes: 0 };
      }

      result.months[month].incomes += amount;
    }

    const numMonths = Object.keys(result.months).length;
    for (const category in result.categories) {
      result.categories[category].monthlyAverage = result.categories[category].total / numMonths;
      result.totalMonthlyAverage += result.categories[category].monthlyAverage;
    }

    return result;

  }, [JSON.stringify(expenses), JSON.stringify(incomes), JSON.stringify(expensesCategories)]);

  return (
    <Wrapper>
      <Box sx={{ flex: 1, display: 'flex' }}>
        <Grid container spacing={2} flexGrow={1}>

          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }} >
            <StatisticsCard sx={{ backgroundColor: "#0d660d" }}>
              <Typography variant="h6" color="white">
                Total Balance
              </Typography>
              <Typography variant="h3" color="white">
                1300.00 CHF
              </Typography>
            </StatisticsCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }} >
            <StatisticsCard sx={{ backgroundColor: "#0d660d" }}>
              <Typography variant="h6" color="white">
                ZKB Balance
              </Typography>
              <Typography variant="h3" color="white">
                3,732.00 CHF
              </Typography>
            </StatisticsCard>
          </Grid>

          <Grid item xs={12} md={6} lg={4} sx={{ display: 'flex' }} >
            <StatisticsCard sx={{ backgroundColor: "#0d660d" }}>
              <Typography variant="h6" color="white">
                Cash Balance
              </Typography>
              <Typography variant="h3" color="white">
                300.00 CHF
              </Typography>
            </StatisticsCard>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: 'flex' }}  >
            <StatisticsCard sx={{ backgroundColor: "primary.dark" }}>
              <Typography variant="h6" color="white">
                Total Spent This Month
              </Typography>
              <Typography variant="h3" color="white">
                {statistics.totalExpensesThisMonth.toFixed(2)} CHF
              </Typography>
            </StatisticsCard>
          </Grid>

          <Grid item xs={12} lg={6} sx={{ display: 'flex' }} >
            <StatisticsCard sx={{ backgroundColor: "#994a00" }}>
              <Typography variant="h6" color="white">
                Average Spendings Per Month
              </Typography>
              <Typography variant="h3" color="white">
                {statistics.totalMonthlyAverage.toFixed(2)} CHF
              </Typography>
            </StatisticsCard>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4, height: '50vh' }} >
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5">
            Expenses Over Time
          </Typography>

          <FormControl>
            <RadioGroup row value={overTimeType} onChange={(e) => setOverTimeType(e.target.value)}>
              <FormControlLabel value="expenses" control={<Radio />} label="Expenses" />
              <FormControlLabel value="incomes" control={<Radio />} label="Incomes" />
              <FormControlLabel value="both" control={<Radio />} label="Both" />
            </RadioGroup>
          </FormControl>

          <Line
            data={{
              labels: Object.keys(statistics.months),
              datasets: [
                {
                  label: 'Amount (CHF)',
                  data: Object.values(statistics.months).map(m => (
                    overTimeType === "expenses" ? m.expenses :
                      overTimeType === "incomes" ? m.incomes :
                        m.incomes - m.expenses
                  )),
                  backgroundColor:
                    overTimeType === "expenses" ? palette.warning.main :
                      overTimeType === "incomes" ? palette.success.main :
                        palette.primary.main,
                  borderColor:
                    overTimeType === "expenses" ? palette.warning.main :
                      overTimeType === "incomes" ? palette.success.main :
                        palette.primary.main,
                }
              ],
            }}
            options={{
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value} CHF`
                  }
                }
              }
            }} />
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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

      <Typography variant="h5">
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
            <TableRow>
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
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StatisticsCard = styled(Box)`
  border-radius: 8px;
  padding: 32px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`; 