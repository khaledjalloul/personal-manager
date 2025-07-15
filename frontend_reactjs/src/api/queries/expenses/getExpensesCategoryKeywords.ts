import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExpensesCategoryKeyword } from "../../../types";
import client from "../../client";

const ENDPOINT = "expenses/categories/keywords";

export type GetExpensesCategoryKeywordsRequestParams = {
  categoryId: number;
};

const queryFn = (params: GetExpensesCategoryKeywordsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetExpensesCategoryKeywordsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetExpensesCategoryKeywordsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useExpensesCategoryKeywords = (params: GetExpensesCategoryKeywordsRequestParams) =>
  useQuery<ExpensesCategoryKeyword[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
