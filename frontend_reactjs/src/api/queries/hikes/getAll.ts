import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Hike } from "../../../types";
import client from "../../client";

const ENDPOINT = "hikes";

export type GetHikesRequestParams = {
};

const queryFn = (params: GetHikesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetHikesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetHikesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useHikes = (params: GetHikesRequestParams) =>
  useQuery<Hike[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((hike) => ({ ...hike, date: new Date(hike.date) })),
    placeholderData: keepPreviousData,
  });
