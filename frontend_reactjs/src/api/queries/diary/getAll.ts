import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { DiaryEntry } from "../../../types";
import client from "../../client";

const ENDPOINT = "diary";

export type GetDiaryEntriesRequestParams = {
};

const queryFn = (params: GetDiaryEntriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetDiaryEntriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetDiaryEntriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDiaryEntries = (params: GetDiaryEntriesRequestParams) =>
  useQuery<DiaryEntry[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((entry) => ({ ...entry, date: new Date(entry.date) })),
    placeholderData: keepPreviousData,
  });
