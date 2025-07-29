import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { JournalEntry } from "../../../types";
import client from "../../client";

const ENDPOINT = "journal";

export type GetJournalEntriesRequestParams = {
  sectionId?: number;
  searchText: string;
};

const queryFn = (params: GetJournalEntriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetJournalEntriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetJournalEntriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useJournalEntries = (params: GetJournalEntriesRequestParams) =>
  useQuery<JournalEntry[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((entry) => ({ ...entry, date: new Date(entry.date) })),
    placeholderData: keepPreviousData,
  });
