import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ToDoMilestone } from "../../../types";

const ENDPOINT = "todo/milestones";

export type CreateToDoMilestoneRequestBody = {
  date: Date;
  description: string;
};

const mutationFn = async (data: CreateToDoMilestoneRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateToDoMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation<ToDoMilestone, AxiosError<{ message: string }>, CreateToDoMilestoneRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
