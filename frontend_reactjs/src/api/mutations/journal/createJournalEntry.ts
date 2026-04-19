import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalEntry, JournalSubEntry } from "../../../types";

const ENDPOINT = "journal";

export type CreateJournalEntryRequestBody = {
  sectionIds: number[];
  date: Date;
  content: string;
  subEntries: JournalSubEntry[];
};

const mutationFn = async (data: CreateJournalEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalEntry, AxiosError<{ message: string }>, CreateJournalEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["journal/categories"],
      });
      queryClient.refetchQueries({
        queryKey: ["journal/sections"],
      });
    },
  });
};
