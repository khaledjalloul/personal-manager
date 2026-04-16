import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { GymExerciseType } from "../../../types";
import client from "../../client";

const ENDPOINT = "sports/gym/exercise-types";

export type GetGymExerciseTypesRequestParams = {
  searchText: string;
  searchInGymSessions: boolean;
};

const queryFn = (params: GetGymExerciseTypesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetGymExerciseTypesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetGymExerciseTypesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useGymExerciseTypes = (params: GetGymExerciseTypesRequestParams) =>
  useQuery<GymExerciseType[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
