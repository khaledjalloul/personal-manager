import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ExpensesCategory } from "../../../types";

const ENDPOINT = "expenses/categories";

export type CreateExpensesCategoryRequestBody = {
  name: string;
  color: string;
};

const mutationFn = async (data: CreateExpensesCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateExpensesCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ExpensesCategory, AxiosError<{ message: string }>, CreateExpensesCategoryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
