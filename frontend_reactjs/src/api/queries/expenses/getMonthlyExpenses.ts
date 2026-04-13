import { keepPreviousData, useQuery } from "@tanstack/react-query";
import client from "../../client";

const ENDPOINT = "expenses/monthly";


export type GetMonthlyExpensesResponse = {
  [month: string]: {
    [category: string]: number;
    total: number;
  };
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

export const useMonthlyExpenses = () =>
  useQuery<GetMonthlyExpensesResponse>({
    queryKey: [ENDPOINT],
    queryFn,
    placeholderData: keepPreviousData,
  });
