import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Expense } from "../../../types";
import client from "../../client";

const ENDPOINT = "expenses";

export type GetExpensesRequestParams = {
  type: "manual" | "auto" | "all";
  searchText: string;
};

const queryFn = (params: GetExpensesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetExpensesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetExpensesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useExpenses = (params: GetExpensesRequestParams) =>
  useQuery<Expense[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((expense) => ({ ...expense, date: new Date(expense.date) })),
    placeholderData: keepPreviousData,
  });
