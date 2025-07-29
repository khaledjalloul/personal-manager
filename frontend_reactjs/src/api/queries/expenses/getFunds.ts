import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExpenseType, Fund } from "../../../types";
import client from "../../client";

const ENDPOINT = "expenses/funds";

export type GetFundsRequestParams = {
  type: ExpenseType | "All";
  searchText: string;
};

const queryFn = (params: GetFundsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetFundsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetFundsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useFunds = (params: GetFundsRequestParams) =>
  useQuery<Fund[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((fund) => ({ ...fund, date: new Date(fund.date) })),
    placeholderData: keepPreviousData,
  });
