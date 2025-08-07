import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ToDoTask, ToDoTaskStatus } from "../../../types";

const ENDPOINT = "todo";

export type EditToDoTaskRequestBody = {
  id: number;
  date?: Date;
  content?: string;
  status?: ToDoTaskStatus;
};

const mutationFn = async (data: EditToDoTaskRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditToDoTask = () => {
  const queryClient = useQueryClient();

  return useMutation<ToDoTask, AxiosError<{ message: string }>, EditToDoTaskRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
