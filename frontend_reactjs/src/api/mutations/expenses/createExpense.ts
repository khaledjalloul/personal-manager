import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Expense, ExpenseType } from "../../../types";

const ENDPOINT = "expenses";

export type CreateExpenseRequestBody = {
  date: Date;
  categoryId?: number;
  description: string;
  vendor: string;
  amount: number;
  tags: string[];
  type: ExpenseType;
};

const mutationFn = async (data: CreateExpenseRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, AxiosError<{ message: string }>, CreateExpenseRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
