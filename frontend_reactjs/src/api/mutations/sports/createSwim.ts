import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Swim } from "../../../types";

const ENDPOINT = "sports/swims";

export type CreateSwimRequestBody = {
  date: Date;
  description: string;
};

const mutationFn = async (data: CreateSwimRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateSwim = () => {
  const queryClient = useQueryClient();

  return useMutation<Swim, AxiosError<{ message: string }>, CreateSwimRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
