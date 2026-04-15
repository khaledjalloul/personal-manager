import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GymExercise } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/gym/exercises";

export type GetGymExercisesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetGymExercisesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetGymExercisesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetGymExercisesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useGymExercises = (params: GetGymExercisesRequestParams) =>
  useQuery<GymExercise[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
