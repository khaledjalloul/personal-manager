import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "todo";

export type DeleteToDoTaskRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteToDoTaskRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDeleteToDoTask = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteToDoTaskRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
