import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { DiaryEntry } from "../../../types";

const ENDPOINT = "diary";

export type CreateDiaryEntryRequestBody = {
  date: Date;
  content: string;
  workContent: string;
};

const mutationFn = async (data: CreateDiaryEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateDiaryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<DiaryEntry, AxiosError<{ message: string }>, CreateDiaryEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
