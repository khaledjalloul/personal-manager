import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { PianoPiece, PianoPieceStatus } from "../../../types";

const ENDPOINT = "piano";

export type EditPianoPieceRequestBody = {
  id: number;
  name?: string;
  origin?: string;
  composer?: string;
  status?: PianoPieceStatus;
  monthLearned?: Date;
  sheetMusicUrl?: string;
  youtubeUrl?: string;
};

const mutationFn = async (data: EditPianoPieceRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditPianoPiece = () => {
  const queryClient = useQueryClient();

  return useMutation<PianoPiece, AxiosError<{ message: string }>, EditPianoPieceRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
