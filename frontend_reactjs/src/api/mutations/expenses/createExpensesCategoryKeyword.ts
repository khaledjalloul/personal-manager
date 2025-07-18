import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ExpensesCategoryKeyword } from "../../../types";

const ENDPOINT = "expenses/categories/keywords";

export type CreateExpensesCategoryKeywordRequestBody = {
  categoryId: number;
  keyword: string;
};

const mutationFn = async (data: CreateExpensesCategoryKeywordRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateExpensesCategoryKeyword = () => {
  const queryClient = useQueryClient();

  return useMutation<ExpensesCategoryKeyword, AxiosError<{ message: string }>, CreateExpensesCategoryKeywordRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
