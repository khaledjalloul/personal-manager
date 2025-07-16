import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "notes/categories";

export type DeleteNoteCategoyRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteNoteCategoyRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeleteNoteCategoy = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteNoteCategoyRequestBody>({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["notes"],
      });
    },
  });
};
