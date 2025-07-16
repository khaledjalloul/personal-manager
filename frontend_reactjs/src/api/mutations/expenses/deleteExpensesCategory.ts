import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "expenses/categories";

export type DeleteExpensesCategoryRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteExpensesCategoryRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeleteExpensesCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteExpensesCategoryRequestBody>({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
