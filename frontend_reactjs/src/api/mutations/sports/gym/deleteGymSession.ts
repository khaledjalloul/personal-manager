import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";

const ENDPOINT = "sports/gym/sessions";

export type DeleteGymSessionRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteGymSessionRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useDeleteGymSession = () => {
  const queryClient = useQueryClient();

  return useMutation<null, AxiosError<{ message: string }>, DeleteGymSessionRequestBody>({
    mutationFn,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["sports/gym/exercise-types"],
      });
      queryClient.refetchQueries({
        queryKey: ["sports/gym/last-exercises"],
      });
    },
  });
};
