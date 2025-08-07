import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalCategory } from "../../../types";

const ENDPOINT = "journal/categories";

export type CreateJournalCategoryRequestBody = {
  name: string;
};

const mutationFn = async (data: CreateJournalCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateJournalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalCategory, AxiosError<{ message: string }>, CreateJournalCategoryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
