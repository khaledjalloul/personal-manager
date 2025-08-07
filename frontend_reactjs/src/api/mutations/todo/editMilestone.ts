import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ToDoMilestone } from "../../../types";

const ENDPOINT = "todo/milestones";

export type EditToDoMilestoneRequestBody = {
  id: number;
  date?: Date;
  description?: string;
};

const mutationFn = async (data: EditToDoMilestoneRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditToDoMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation<ToDoMilestone, AxiosError<{ message: string }>, EditToDoMilestoneRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
