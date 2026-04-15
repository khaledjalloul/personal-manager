import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Run } from "../../../types";

const ENDPOINT = "sports/runs";

export type CreateRunRequestBody = {
  date: Date;
  description: string;
  distance: number;
  duration: number;
  elevationGain: number;
};

const mutationFn = async (data: CreateRunRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateRun = () => {
  const queryClient = useQueryClient();

  return useMutation<Run, AxiosError<{ message: string }>, CreateRunRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
