

import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../../client";
import { AxiosError } from "axios";

const ENDPOINT = "sports/runs/sync";
const { REACT_APP_CLIENT_URL, REACT_APP_STRAVA_CLIENT_ID } = process.env;
export const STRAVA_AUTH_URL = `https://www.strava.com/oauth/authorize?client_id=${REACT_APP_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${REACT_APP_CLIENT_URL}/%23/sports/running&approval_prompt=force&scope=read,activity:read_all`;

export type SyncRunsRequestBody = {
  authorizationCode: string;
};

const mutationFn = async (data: SyncRunsRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useSyncRuns = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string }>, SyncRunsRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: ["sports/runs"],
      });
    },
  });
};
