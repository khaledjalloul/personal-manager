import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NoteCategory } from "../../../types";
import client from "../../client";

const ENDPOINT = "notes/categories";

export type GetNoteCategoriesRequestParams = {
};

const queryFn = (params: GetNoteCategoriesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetNoteCategoriesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetNoteCategoriesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useNoteCategories = (params: GetNoteCategoriesRequestParams) =>
  useQuery<NoteCategory[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
