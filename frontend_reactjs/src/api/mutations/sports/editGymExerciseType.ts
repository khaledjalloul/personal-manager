import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { GymExerciseType } from "../../../types";

const ENDPOINT = "sports/gym/exercise-types";

export type EditGymExerciseTypeRequestBody = {
  id: number;
  name?: string;
  description?: string;
};

const mutationFn = async (data: EditGymExerciseTypeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditGymExerciseType = () => {
  const queryClient = useQueryClient();

  return useMutation<GymExerciseType, AxiosError<{ message: string }>, EditGymExerciseTypeRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
