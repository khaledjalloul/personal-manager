import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Income } from "../../../types";
import client from "../../client";

const ENDPOINT = "incomes";

export type GetIncomesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetIncomesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetIncomesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetIncomesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useIncomes = (params: GetIncomesRequestParams) =>
  useQuery<Income[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((income) => ({ ...income, date: new Date(income.date) })),
    placeholderData: keepPreviousData,
  });
