import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";
import { Hike } from "../../../../types";

const ENDPOINT = "sports/hikes";

export type CreateHikeRequestBody = {
  date: Date;
  description: string;
  distance: number;
  ascent: number;
  descent: number;
  movingTime: number;
  elapsedTime: number;
  coverImage: string;
  images: string[];
  googleMapsUrl: string;
  stravaActivityId: string;
  mapPolyline: string;
};

const mutationFn = async (data: CreateHikeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateHike = () => {
  const queryClient = useQueryClient();

  return useMutation<Hike, AxiosError<{ message: string }>, CreateHikeRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
