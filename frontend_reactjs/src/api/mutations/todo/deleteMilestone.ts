import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "todo/milestones";

export type DeleteToDoMilestoneRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteToDoMilestoneRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDeleteToDoMilestone = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteToDoMilestoneRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["todo"],
      });
    },
  });
};
