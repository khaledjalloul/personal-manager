import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "journal";

export type DeleteJournalEntryRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteJournalEntryRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteJournalEntryRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
