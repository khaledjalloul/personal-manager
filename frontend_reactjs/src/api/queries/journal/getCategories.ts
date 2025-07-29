import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { JournalCategory } from "../../../types";
import client from "../../client";

const ENDPOINT = "journal/categories";

export type GetJournalCategoriesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetJournalCategoriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetJournalCategoriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetJournalCategoriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useJournalCategories = (params: GetJournalCategoriesRequestParams) =>
  useQuery<JournalCategory[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
