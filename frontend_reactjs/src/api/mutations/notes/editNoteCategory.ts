import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { NoteCategory } from "../../../types";

const ENDPOINT = "notes/categories";

export type EditNoteCategoryRequestBody = {
  id: number;
  name?: string;
};

const mutationFn = async (data: EditNoteCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditNoteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<NoteCategory, AxiosError<{ message: string }>, EditNoteCategoryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
