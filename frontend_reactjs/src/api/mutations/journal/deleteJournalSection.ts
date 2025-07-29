import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "journal/sections";

export type DeleteJournalSectionRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteJournalSectionRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeleteJournalSection = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteJournalSectionRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["journal"],
      });
    },
  });
};
