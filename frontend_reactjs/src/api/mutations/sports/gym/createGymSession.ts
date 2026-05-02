import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";
import { GymExercise, GymSession } from "../../../../types";

const ENDPOINT = "sports/gym/sessions";

export type CreateGymSessionRequestBody = {
  date: Date;
  note: string;
  exercises: GymExercise[];
};

const mutationFn = async (data: CreateGymSessionRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateGymSession = () => {
  const queryClient = useQueryClient();

  return useMutation<GymSession, AxiosError<{ message: string }>, CreateGymSessionRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["sports/gym/last-exercises"],
      });
    },
  });
};
