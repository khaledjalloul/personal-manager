import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { NoteCategory } from "../../../types";

const ENDPOINT = "notes/categories";

export type CreateNoteCategoryRequestBody = {
  name: string;
};

const mutationFn = async (data: CreateNoteCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateNoteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<NoteCategory, AxiosError<{ message: string }>, CreateNoteCategoryRequestBody>({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
