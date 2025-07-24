import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { DiaryEntry, DiaryEntryType } from "../../../types";

const ENDPOINT = "diary";

export type EditDiaryEntryRequestBody = {
  id: number;
  date?: Date;
  content?: string;
  workContent?: string;
  type?: DiaryEntryType;
};

const mutationFn = async (data: EditDiaryEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useEditDiaryEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<DiaryEntry, AxiosError<{ message: string }>, EditDiaryEntryRequestBody>({
    mutationFn,
    onSuccess: (data, variables) => {
      queryClient.refetchQueries({
        queryKey: variables.type === DiaryEntryType.Daily ? ["diary/daily"] : ["diary/monthly"],
      });
    },
  });
};
