import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalSection } from "../../../types";

const ENDPOINT = "journal/sections";

export type CreateJournalSectionRequestBody = {
  categoryId: number;
  name: string;
};

const mutationFn = async (data: CreateJournalSectionRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateJournalSection = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalSection, AxiosError<{ message: string }>, CreateJournalSectionRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
