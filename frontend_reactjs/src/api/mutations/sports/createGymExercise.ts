import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { GymExercise } from "../../../types";

const ENDPOINT = "sports/gym/exercises";

export type CreateGymExerciseRequestBody = {
  typeId: number;
  sessionId: number;
  weight: number;
  sets: number;
  reps: number;
  note: string;
};

const mutationFn = async (data: CreateGymExerciseRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateGymExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<GymExercise, AxiosError<{ message: string }>, CreateGymExerciseRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
