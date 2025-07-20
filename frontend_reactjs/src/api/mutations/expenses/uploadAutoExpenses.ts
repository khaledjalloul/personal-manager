import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "expenses/auto";

export type UploadAutoExpensesRequestBody = {
  formData: FormData;
};

const mutationFn = async (data: UploadAutoExpensesRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data.formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => res.data)
    .catch((err) => {
      console.error(`upload-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useUploadAutoExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, UploadAutoExpensesRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["expenses"],
      });
      queryClient.refetchQueries({
        queryKey: ["expenses/funds"],
      });
    },
  });
}

