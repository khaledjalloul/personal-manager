import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { CalendarEntry, Note } from "../../../types";
import client from "../../client";

const ENDPOINT = "calendar";

export type GetCalendarEntriesRequestParams = {
  date: Date;
  searchText: string;
};

const queryFn = (params: GetCalendarEntriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetCalendarEntriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetCalendarEntriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCalendarEntries = (params: GetCalendarEntriesRequestParams) =>
  useQuery<CalendarEntry[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((entry) => ({
        ...entry,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate)
      })),
    placeholderData: keepPreviousData,
  });
