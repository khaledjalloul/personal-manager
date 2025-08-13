import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ToDoTask } from "../../../types";
import client from "../../client";

const ENDPOINT = "todo";

export type GetToDoTasksRequestParams = {
  searchText: string;
  milestoneId?: number;
  isArchived: boolean;
};

const queryFn = (params: GetToDoTasksRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetToDoTasksRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetToDoTasksRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useToDoTasks = (params: GetToDoTasksRequestParams) =>
  useQuery<ToDoTask[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((task) => ({
        ...task,
        dateCreated: task.dateCreated && new Date(task.dateCreated),
        dateModified: task.dateModified && new Date(task.dateModified)
      })),
    placeholderData: keepPreviousData,
  });
