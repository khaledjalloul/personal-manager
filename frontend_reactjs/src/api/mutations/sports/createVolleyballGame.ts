import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { VolleyballGame } from "../../../types";

const ENDPOINT = "sports/volleyball-games";

export type CreateVolleyballGameRequestBody = {
  date: Date;
  description: string;
};

const mutationFn = async (data: CreateVolleyballGameRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateVolleyballGame = () => {
  const queryClient = useQueryClient();

  return useMutation<VolleyballGame, AxiosError<{ message: string }>, CreateVolleyballGameRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
