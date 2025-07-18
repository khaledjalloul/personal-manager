import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { VideoGame } from "../../../types";
import client from "../../client";

const ENDPOINT = "video-games";

export type GetVideoGamesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetVideoGamesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetVideoGamesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetVideoGamesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useVideoGames = (params: GetVideoGamesRequestParams) =>
  useQuery<VideoGame[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((game) => ({ ...game, firstPlayed: new Date(game.firstPlayed) })),
    placeholderData: keepPreviousData,
  });
