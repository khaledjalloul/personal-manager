import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

const ENDPOINT = "piano";

export type DeletePianoPieceRequestBody = {
  id: number;
};

const mutationFn = async (data: DeletePianoPieceRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeletePianoPiece = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeletePianoPieceRequestBody>({
    mutationFn: mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
