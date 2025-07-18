import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { User } from "../../../types";
import client from "../../client";

const ENDPOINT = "users/me";

const queryFn = async () => {
  return await client
    .get(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCurrentUser = () =>
  useQuery<User[]>({
    queryKey: [ENDPOINT],
    queryFn,
    placeholderData: keepPreviousData,
  });
