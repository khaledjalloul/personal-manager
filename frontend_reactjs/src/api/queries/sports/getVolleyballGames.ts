import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VolleyballGame } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/volleyball-games";

export type GetVolleyballGamesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetVolleyballGamesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetVolleyballGamesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetVolleyballGamesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useVolleyballGames = (params: GetVolleyballGamesRequestParams) =>
  useQuery<VolleyballGame[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((volleyballGame) => ({ ...volleyballGame, date: new Date(volleyballGame.date) })),
    placeholderData: keepPreviousData,
  });
