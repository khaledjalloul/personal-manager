import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Expense, ExpenseType } from "../../../types";

const ENDPOINT = "expenses";

export type EditExpenseRequestBody = {
  id: number;
  date?: Date;
  categoryId?: number;
  description?: string;
  vendor?: string;
  amount?: number;
  tags?: string[];
  type?: ExpenseType;
};

const mutationFn = async (data: EditExpenseRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditExpense = () => {
  const queryClient = useQueryClient();

  return useMutation<Expense, AxiosError<{ message: string }>, EditExpenseRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
