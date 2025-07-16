import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Note } from "../../../types";

const ENDPOINT = "notes";

export type EditNoteRequestBody = {
  id: number;
  dateCreated?: Date;
  dateModified?: Date;
  categoryId?: number;
  title?: string;
  content?: string;
  tags?: string[];
};

const mutationFn = async (data: EditNoteRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useEditNote = () => {
  const queryClient = useQueryClient();

  return useMutation<Note, AxiosError<{ message: string }>, EditNoteRequestBody>({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
