import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { GymExercise, GymSession } from "../../../types";

const ENDPOINT = "sports/gym/sessions";

export type EditGymSessionRequestBody = {
  id: number;
  date?: Date;
  note?: string;
  exercises?: GymExercise[];
};

const mutationFn = async (data: EditGymSessionRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditGymSession = () => {
  const queryClient = useQueryClient();

  return useMutation<GymSession, AxiosError<{ message: string }>, EditGymSessionRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
