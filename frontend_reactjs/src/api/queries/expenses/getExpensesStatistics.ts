import { keepPreviousData, useQuery } from "@tanstack/react-query";
import client from "../../client";

const ENDPOINT = "expenses/statistics";

export type GetExpensesStatisticsResponse = {
  totalMonthlyAverage: number;
  totalExpenses: number;
  totalExpensesThisMonth: number;
  totalFunds: number;
  categories: {
    [category: string]: {
      monthlyAverage: number;
      total: number;
    };
  }
  months: {
    [month: string]: {
      expenses: number;
      funds: number;
    }
  }
};

const queryFn = async () => {
  return await client
    .get(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useExpensesStatistics = () =>
  useQuery<GetExpensesStatisticsResponse>({
    queryKey: [ENDPOINT],
    queryFn,
    placeholderData: keepPreviousData,
  });
