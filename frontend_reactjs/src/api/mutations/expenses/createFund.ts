import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ExpenseType, Fund } from "../../../types";

const ENDPOINT = "expenses/funds";

export type CreateFundRequestBody = {
  date: Date;
  source: string;
  amount: number;
  type: ExpenseType;
};

const mutationFn = async (data: CreateFundRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateFund = () => {
  const queryClient = useQueryClient();

  return useMutation<Fund, AxiosError<{ message: string }>, CreateFundRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
