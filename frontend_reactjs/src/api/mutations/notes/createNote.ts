import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Note } from "../../../types";

const ENDPOINT = "notes";

export type CreateNoteRequestBody = {
  dateCreated: Date;
  dateModified: Date;
  categoryId: number;
  title: string;
  content: string;
  tags: string[];
};

const mutationFn = async (data: CreateNoteRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, AxiosError<{ message: string }>, CreateNoteRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
