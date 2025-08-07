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
import { useContext, useState } from "react";
import { useCurrentUser, useExpensesCategories, useExpensesStatistics } from "../../../api";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { ThemeContext } from "../../../utils";
import { ExpensesStatisticsCard } from "../../../components";

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

export const ExpensesStatistics = () => {
  const { palette } = useTheme();
  const { themeData } = useContext(ThemeContext);

  const [overTimeType, setOverTimeType] = useState("both");

  const { data: user } = useCurrentUser();
  const { data: expensesCategories } = useExpensesCategories();
  const { data: statistics } = useExpensesStatistics();

  if (!statistics || !user) return <div />
  return (
    <Wrapper sx={{ overflowY: { sx: 'unset', sm: 'auto' } }}>
      <Grid container spacing={2} flexGrow={1}>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExpensesStatisticsCard
            title="Total Balance"
            value={statistics.totalFunds - statistics.totalExpenses + user.wallet}
            color="success.dark"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <ExpensesStatisticsCard
            title="Bank Balance"
            value={statistics.totalFunds - statistics.totalExpenses}
            color="success.dark"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }} sx={{ display: 'flex' }}>
          <ExpensesStatisticsCard
            title="Wallet Balance"
            value={user.wallet}
            color="success.dark"
            isWallet
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ExpensesStatisticsCard
            title="Total Spent This Month"
            value={statistics.totalExpensesThisMonth}
            color="primary.dark"
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ExpensesStatisticsCard
            title="Average Expenses Per Month"
            value={statistics.monthlyAverageExpenses}
            color="warning.dark"
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 5, mb: { xs: 0, md: 5 } }}>
        <Grid container spacing={{ xs: 10, md: 5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
              maxHeight: '50vh',
            }}>
              <Typography variant="h5">
                Expenses Over Time
              </Typography>

              <FormControl>
                <RadioGroup row value={overTimeType} onChange={(e) => setOverTimeType(e.target.value)}>
                  <FormControlLabel value="expenses" control={<Radio />} label="Expenses" />
                  <FormControlLabel value="funds" control={<Radio />} label="Funds" />
                  <FormControlLabel value="both" control={<Radio />} label="Both" />
                </RadioGroup>
              </FormControl>

              <Line
                data={{
                  labels: Object.keys(statistics.months).sort(),
                  datasets: [
                    {
                      label: 'Amount (CHF)',
                      data: Object.entries(statistics.months)
                        .sort((a, b) => a[0].localeCompare(b[0]))
                        .map((m) => (
                          overTimeType === "expenses" ? m[1].expenses :
                            overTimeType === "funds" ? m[1].funds :
                              m[1].total
                        )),
                      backgroundColor:
                        overTimeType === "expenses" ? palette.warning.main :
                          overTimeType === "funds" ? palette.success.main :
                            palette.primary.main,
                      borderColor:
                        overTimeType === "expenses" ? palette.warning.main :
                          overTimeType === "funds" ? palette.success.main :
                            palette.primary.main,
                    }
                  ],
                }}
                options={{
                  scales: {
                    y: {
                      ticks: {
                        callback: (value) => `${value} CHF`,
                        color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                      }
                    },
                    x: {
                      ticks: {
                        color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                  }
                }} />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              maxHeight: '50vh',
            }}>
              <Typography variant="h5">
                Total Expenses Per Category
              </Typography>

              <Doughnut
                data={{
                  labels: Object.keys(statistics.categories),
                  datasets: [
                    {
                      label: 'Amount (CHF)',
                      data: Object.values(statistics.categories).map(c => c.total),
                      backgroundColor: Object.keys(statistics.categories).map(c => expensesCategories?.find(cat => cat.name === c)?.color),
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
                        color: themeData.darkMode ? palette.grey[400] : palette.grey[700],
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
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h5">
        Expenses per Month
      </Typography>

      <Box>
        <TableContainer component={Paper} sx={{ maxWidth: 'calc(100vw - 64px - 16px)' }}>
          <Table
            size="medium"
            sx={{
              '& th': {
                backgroundColor: "primary.main",
                color: "primary.contrastText"
              }
            }}
          >
            <TableHead>
              <TableRow>
                {Object.keys(statistics.categories).map((categoryName) => (
                  <TableCell key={categoryName} sx={{ fontWeight: 'bold' }}>
                    {categoryName}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                {Object.values(statistics.categories).map((category, index) => (
                  <TableCell key={index}>
                    {category.monthlyAverage.toFixed(2)} CHF
                  </TableCell>
                ))}
                <TableCell>{statistics.monthlyAverageExpenses.toFixed(2)} CHF</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Wrapper >
  );
};

const Wrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  padding-top: 0;
`;
