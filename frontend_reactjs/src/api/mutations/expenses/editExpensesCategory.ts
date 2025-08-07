import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ExpensesCategory } from "../../../types";

const ENDPOINT = "expenses/categories";

export type EditExpensesCategoryRequestBody = {
  id: number;
  name?: string;
  color?: string;
  keywords?: string[];
};

const mutationFn = async (data: EditExpensesCategoryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditExpensesCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ExpensesCategory, AxiosError<{ message: string }>, EditExpensesCategoryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
