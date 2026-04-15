import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { GymExerciseType } from "../../../types";

const ENDPOINT = "sports/gym/exercise-types";

export type CreateGymExerciseTypeRequestBody = {
  name: string;
  description: string;
};

const mutationFn = async (data: CreateGymExerciseTypeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateGymExerciseType = () => {
  const queryClient = useQueryClient();

  return useMutation<GymExerciseType, AxiosError<{ message: string }>, CreateGymExerciseTypeRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
