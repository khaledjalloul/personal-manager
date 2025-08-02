import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { useContext } from "react";
import { UserContext } from "../../../utils";

const ENDPOINT = "users";

export type DeleteUserRequestBody = {
  id: number;
};

const mutationFn = async (data: DeleteUserRequestBody) => {
  return await client
    .delete(`/${ENDPOINT}/${data.id}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`delete-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useDeleteUser = () => {
  const { setUserData } = useContext(UserContext);

  return useMutation<null, AxiosError<{ message: string }>, DeleteUserRequestBody>({
    mutationFn,
    onSuccess: () => setUserData(null),
  });
};
