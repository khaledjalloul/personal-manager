import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Run } from "../../../types";

const ENDPOINT = "sports/runs";

export type EditRunRequestBody = {
  id: number;
  date?: Date;
  description?: string;
  distance?: number;
  duration?: number;
  elevationGain?: number;
};

const mutationFn = async (data: EditRunRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditRun = () => {
  const queryClient = useQueryClient();

  return useMutation<Run, AxiosError<{ message: string }>, EditRunRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
