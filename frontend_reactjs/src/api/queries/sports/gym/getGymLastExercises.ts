import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GymExerciseType } from "../../../../types";
import client from "../../../client";

const ENDPOINT = "sports/gym/last-exercises";

const queryFn = async () => {
  return await client
    .get(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useGymLastExercises = () =>
  useQuery<GymExerciseType[]>({
    queryKey: [ENDPOINT],
    queryFn,
    placeholderData: keepPreviousData,
  });
