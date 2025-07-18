import { keepPreviousData, useQuery } from "@tanstack/react-query";
import client from "../../client";

const ENDPOINT = "expenses/monthly";

export type GetMonthlyExpensesRequestParams = {
  searchText: string;
};

export type GetMonthlyExpensesResponse = {
  [month: string]: {
    [category: string]: number;
    total: number;
  };
};

const queryFn = (params: GetMonthlyExpensesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetMonthlyExpensesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetMonthlyExpensesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useMonthlyExpenses = (params: GetMonthlyExpensesRequestParams) =>
  useQuery<GetMonthlyExpensesResponse>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
