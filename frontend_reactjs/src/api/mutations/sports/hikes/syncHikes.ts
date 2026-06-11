

import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";

const ENDPOINT = "sports/hikes/sync";

export type SyncHikesRequestBody = {
  authorizationCode: string;
};

const mutationFn = async (data: SyncHikesRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useSyncHikes = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, SyncHikesRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: ["sports/hikes"],
      });
    },
  });
};
