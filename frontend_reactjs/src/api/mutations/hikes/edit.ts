import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Hike } from "../../../types";

const ENDPOINT = "hikes";

export type EditHikeRequestBody = {
  id: number;
  date?: Date;
  description?: string;
  distance?: number;
  ascent?: number;
  descent?: number;
  duration?: number;
  durationWithBreaks?: number;
  coverImage?: string;
  images?: string[];
  googleMapsUrl?: string;
};

const mutationFn = async (data: EditHikeRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditHike = () => {
  const queryClient = useQueryClient();

  return useMutation<Hike, AxiosError<{ message: string }>, EditHikeRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
