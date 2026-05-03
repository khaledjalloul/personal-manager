import { useMutation } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";
import { Run } from "../../../../types";

const ENDPOINT = "sports/runs/upload";

export type UploadRunFitFileRequestBody = {
  formData: FormData;
};

const mutationFn = async (data: UploadRunFitFileRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`upload-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useUploadRunFitFile = () => {
  return useMutation<Run, AxiosError<{ message: string }>, UploadRunFitFileRequestBody>({
    mutationFn,
  });
};
