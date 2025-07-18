import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { PianoPiece } from "../../../types";
import client from "../../client";

const ENDPOINT = "piano";

export type GetPianoPiecesRequestParams = {
};

const queryFn = (params: GetPianoPiecesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetPianoPiecesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetPianoPiecesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const usePianoPieces = (params: GetPianoPiecesRequestParams) =>
  useQuery<PianoPiece[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((piece) => ({ ...piece, monthLearned: piece.monthLearned && new Date(piece.monthLearned) })),
    placeholderData: keepPreviousData,
  });
