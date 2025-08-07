import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { VideoGame, VideoGameType } from "../../../types";

const ENDPOINT = "video-games";

export type EditVideoGameRequestBody = {
  id: number;
  name?: string;
  platform?: string;
  type?: VideoGameType;
  completionCount?: number;
  firstPlayed?: Date;
  price?: string;
  extraPurchases?: string;
  storeUrl?: string;
  coverImage?: string;
};

const mutationFn = async (data: EditVideoGameRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditVideoGame = () => {
  const queryClient = useQueryClient();

  return useMutation<VideoGame, AxiosError<{ message: string }>, EditVideoGameRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
