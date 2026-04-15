import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { VolleyballGame } from "../../../types";

const ENDPOINT = "sports/volleyball-games";

export type EditVolleyballGameRequestBody = {
  id: number;
  date?: Date;
  description?: string;
};

const mutationFn = async (data: EditVolleyballGameRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditVolleyballGame = () => {
  const queryClient = useQueryClient();

  return useMutation<VolleyballGame, AxiosError<{ message: string }>, EditVolleyballGameRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
