import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { DiaryEntry, DiaryEntryType } from "../../../types";

const ENDPOINT = "diary";

export type EditDiaryEntryRequestBody = {
  id: number;
  content?: string;
  workContent?: string;
};

const mutationFn = async (data: EditDiaryEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditDiaryEntry = (type: DiaryEntryType) => {
  const queryClient = useQueryClient();

  return useMutation<DiaryEntry, AxiosError<{ message: string }>, EditDiaryEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: type === DiaryEntryType.Daily ? ["diary/daily"] : ["diary/monthly"],
      });
    },
  });
};
