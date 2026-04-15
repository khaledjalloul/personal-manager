import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GymSession } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/gym/sessions";

export type GetGymSessionsRequestParams = {
  searchText: string;
  sortOrder?: "asc" | "desc";
};

const queryFn = (params: GetGymSessionsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetGymSessionsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetGymSessionsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useGymSessions = (params: GetGymSessionsRequestParams) =>
  useQuery<GymSession[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((gymSession) => ({ ...gymSession, date: new Date(gymSession.date) })),
    placeholderData: keepPreviousData,
  });
