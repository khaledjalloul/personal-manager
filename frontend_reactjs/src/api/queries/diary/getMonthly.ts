import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DiaryEntry } from "../../../types";
import client from "../../client";

const ENDPOINT = "diary/monthly";

export type GetMonthlyDiaryEntriesRequestParams = {
  year: number;
};

export type GetMonthlyDiaryEntriesResponse = {
  months: Date[];
  entries: DiaryEntry[];
}

const queryFn = (params: GetMonthlyDiaryEntriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetMonthlyDiaryEntriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetMonthlyDiaryEntriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useMonthlyDiaryEntries = (params: GetMonthlyDiaryEntriesRequestParams) =>
  useQuery<GetMonthlyDiaryEntriesResponse>({
    queryKey: [ENDPOINT, JSON.stringify(params)],
    queryFn: queryFn(params),
    select: (data) =>
    ({
      months: data.months.map(date => new Date(date)),
      entries: data.entries.map((entry) => ({ ...entry, date: new Date(entry.date) }))
    }),
    placeholderData: keepPreviousData,
  });
