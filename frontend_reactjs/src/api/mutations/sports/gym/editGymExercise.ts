import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";
import { GymExercise } from "../../../../types";

const ENDPOINT = "sports/gym/exercises";

export type EditGymExerciseRequestBody = {
  id: number;
  typeId?: number;
  sessionId?: number;
  weight?: number;
  sets?: number;
  reps?: number;
  note?: string;
};

const mutationFn = async (data: EditGymExerciseRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditGymExercise = () => {
  const queryClient = useQueryClient();

  return useMutation<GymExercise, AxiosError<{ message: string }>, EditGymExerciseRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
      queryClient.refetchQueries({
        queryKey: ["sports/gym/exercise-types"],
      });
    },
  });
};
