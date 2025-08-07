import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { JournalCategory } from "../../../types";

const ENDPOINT = "journal/categories";

export type EditJournalCategoryRequestBody = {
  id: number;
  name?: string;
};

const mutationFn = async (data: EditJournalCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditJournalCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<JournalCategory, AxiosError<{ message: string }>, EditJournalCategoryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
