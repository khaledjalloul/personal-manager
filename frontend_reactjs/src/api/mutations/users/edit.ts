import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { User } from "../../../types";

const ENDPOINT = "users/me";

export type EditUserRequestBody = {
  name?: string;
  email?: string;
  wallet?: number;
  fundKeywords?: string[];
};

const mutationFn = async (data: EditUserRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError<{ message: string }>, EditUserRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
