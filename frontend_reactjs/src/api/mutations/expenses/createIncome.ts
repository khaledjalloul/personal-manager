import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Income } from "../../../types";

const ENDPOINT = "expenses/incomes";

export type CreateIncomeRequestBody = {
  date: Date;
  source: string;
  amount: number;
};

const mutationFn = async (data: CreateIncomeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateIncome = () => {
  const queryClient = useQueryClient();

  return useMutation<Income, AxiosError<{ message: string }>, CreateIncomeRequestBody>({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
