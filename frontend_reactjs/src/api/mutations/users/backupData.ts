import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "users/backup";

export type BackUpDataRequestParams = {
  dataType: string;
};

const mutationFn = async (params: BackUpDataRequestParams) => {
  return await client
    .get(`/${ENDPOINT}/${params.dataType}`, {
      responseType: 'blob'
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useBackupData = () =>
  useMutation<Blob, AxiosError<{ message: string }>, BackUpDataRequestParams>({
    mutationFn,
    onSuccess: (data, variables) => {
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `backup-${variables.dataType}-${new Date().toISOString()}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });