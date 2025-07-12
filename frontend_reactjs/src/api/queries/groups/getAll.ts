import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Group } from "../../../types";
import client from "../../client";

type Request = {
  maxUsers?: string | number;
  searchText?: string;
};

const getGroups = (params: Request) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof Request] !== undefined)
    .map((key) => `${key}=${params[key as keyof Request]}`)
    .join("&");

  return await client
    .get(`/groups?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error("groups-error", err?.response?.data);
      throw err;
    });
};

export const useGroups = (params: Request) =>
  useQuery<Group[]>({
    queryKey: ["groups", params],
    queryFn: getGroups(params),
    select: (data) =>
      data.map((group) => ({ ...group, time: new Date(group.time) })),
    placeholderData: keepPreviousData,
  });
