import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "users/restore";

export type RestoreDataRequestBody = {
  dataType: string;
  formData: FormData;
};

const mutationFn = async (data: RestoreDataRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.dataType}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useRestoreData = () =>
  useMutation<void, AxiosError<{ message: string }>, RestoreDataRequestBody>({
    mutationFn,
  });

