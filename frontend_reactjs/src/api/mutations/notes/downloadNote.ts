import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "notes/download";

export type DownloadNoteParams = {
  id: number;
  title: string;
};

const mutationFn = async (params: DownloadNoteParams) => {
  return await client
    .get(`/${ENDPOINT}/${params.id}`, {
      responseType: 'blob'
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDownloadNote = () =>
  useMutation<Blob, AxiosError<{ message: string }>, DownloadNoteParams>({
    mutationFn,
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${variables.title}.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });