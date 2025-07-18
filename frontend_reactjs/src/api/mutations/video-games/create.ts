import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { VideoGame, VideoGameType } from "../../../types";

const ENDPOINT = "video-games";

export type CreateVideoGameRequestBody = {
  name: string;
  platform: string;
  type: VideoGameType;
  completed: boolean;
  firstPlayed: Date;
  price: number;
  extraPurchases: {
    name: string;
    price: number;
  }[];
  storeUrl: string;
  coverImage: string;
};

const mutationFn = async (data: CreateVideoGameRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateVideoGame = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoGame, AxiosError<{ message: string }>, CreateVideoGameRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
