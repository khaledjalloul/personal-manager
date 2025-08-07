import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { ExpenseType, Fund } from "../../../types";

const ENDPOINT = "expenses/funds";

export type EditFundRequestBody = {
  id: number;
  date?: Date;
  source?: string;
  amount?: number;
  type?: ExpenseType;
};

const mutationFn = async (data: EditFundRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditFund = () => {
  const queryClient = useQueryClient();

  return useMutation<Fund, AxiosError<{ message: string }>, EditFundRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
