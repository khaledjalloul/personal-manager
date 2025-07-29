import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalEntry } from "../../../types";

const ENDPOINT = "journal";

export type EditJournalEntryRequestBody = {
  id: number;
  date?: Date;
  content?: string;
};

const mutationFn = async (data: EditJournalEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useEditJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalEntry, AxiosError<{ message: string }>, EditJournalEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
