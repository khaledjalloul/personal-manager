import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ToDoTask } from "../../../types";

const ENDPOINT = "todo";

export type CreateToDoTaskRequestBody = {
  date: Date;
  content: string;
  milestoneId?: number;
};

const mutationFn = async (data: CreateToDoTaskRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateToDoTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ToDoTask, AxiosError<{ message: string }>, CreateToDoTaskRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
