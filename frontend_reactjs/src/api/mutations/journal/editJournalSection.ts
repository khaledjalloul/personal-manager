import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalSection } from "../../../types";

const ENDPOINT = "journal/sections";

export type EditJournalSectionRequestBody = {
  id: number;
  name?: string;
};

const mutationFn = async (data: EditJournalSectionRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditJournalSection = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalSection, AxiosError<{ message: string }>, EditJournalSectionRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
