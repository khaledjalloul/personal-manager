import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ToDoMilestone } from "../../../types";
import client from "../../client";

const ENDPOINT = "todo/milestones";

export type GetToDoMilestonesRequestParams = {
  searchText: string;
};

const queryFn = (params: GetToDoMilestonesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetToDoMilestonesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetToDoMilestonesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useToDoMilestones = (params: GetToDoMilestonesRequestParams) =>
  useQuery<ToDoMilestone[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((milestone) => ({ ...milestone, monthLearned: milestone.date && new Date(milestone.date) })),
    placeholderData: keepPreviousData,
  });
