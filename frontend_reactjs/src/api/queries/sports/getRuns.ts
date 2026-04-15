import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Run } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/runs";

export type GetRunsRequestParams = {
  searchText: string;
};

const queryFn = (params: GetRunsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetRunsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetRunsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useRuns = (params: GetRunsRequestParams) =>
  useQuery<Run[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((run) => ({ ...run, date: new Date(run.date) })),
    placeholderData: keepPreviousData,
  });
