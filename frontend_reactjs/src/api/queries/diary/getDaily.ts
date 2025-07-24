import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DiaryEntry } from "../../../types";
import client from "../../client";

const ENDPOINT = "diary/daily";

export type GetDailyDiaryEntriesRequestParams = {
  year: number;
  month: number;
  searchText: string;
};

const queryFn = (params: GetDailyDiaryEntriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetDailyDiaryEntriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetDailyDiaryEntriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDailyDiaryEntries = (params: GetDailyDiaryEntriesRequestParams) =>
  useQuery<DiaryEntry[]>({
    queryKey: [ENDPOINT, JSON.stringify(params)],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((entry) => ({ ...entry, date: new Date(entry.date) })),
    placeholderData: keepPreviousData,
  });
