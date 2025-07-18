import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { PianoPiece, PianoPieceStatus } from "../../../types";

const ENDPOINT = "piano";

export type CreatePianoPieceRequestBody = {
  name: string;
  origin: string;
  composer: string;
  status: PianoPieceStatus;
  monthLearned?: Date;
  sheetMusicUrl: string;
  youtubeUrl: string;
};

const mutationFn = async (data: CreatePianoPieceRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreatePianoPiece = () => {
  const queryClient = useQueryClient();

  return useMutation<PianoPiece, AxiosError<{ message: string }>, CreatePianoPieceRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
