import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Income } from "../../../types";

const ENDPOINT = "expenses/incomes";

export type EditIncomeRequestBody = {
  id: number;
  date?: Date;
  source?: string;
  amount?: number;
};

const mutationFn = async (data: EditIncomeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useEditIncome = () => {
  const queryClient = useQueryClient();

  return useMutation<Income, AxiosError<{ message: string }>, EditIncomeRequestBody>({
    mutationFn: mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
