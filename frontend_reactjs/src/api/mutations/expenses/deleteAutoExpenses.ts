import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "expenses/auto";

const mutationFn = async () => {
  return await client
    .delete(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDeleteAutoExpenses = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["expenses"],
      });
      queryClient.refetchQueries({
        queryKey: ["expenses/funds"],
      });
    },
  });
};
