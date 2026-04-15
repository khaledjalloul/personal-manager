import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Swim } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/swims";

export type GetSwimsRequestParams = {
  searchText: string;
};

const queryFn = (params: GetSwimsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetSwimsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetSwimsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useSwims = (params: GetSwimsRequestParams) =>
  useQuery<Swim[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((swim) => ({ ...swim, date: new Date(swim.date) })),
    placeholderData: keepPreviousData,
  });
