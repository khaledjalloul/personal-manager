import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Hike, Swim } from "../../../types";

const ENDPOINT = "sports/swims";

export type EditSwimRequestBody = {
  id: number;
  date?: Date;
  description?: string;
};

const mutationFn = async (data: EditSwimRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditSwim = () => {
  const queryClient = useQueryClient();

  return useMutation<Swim, AxiosError<{ message: string }>, EditSwimRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
