import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Note } from "../../../types";
import client from "../../client";

const ENDPOINT = "notes";

export type GetNotesRequestParams = {
  categoryId?: number;
  searchText: string;
};

const queryFn = (params: GetNotesRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetNotesRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetNotesRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useNotes = (params: GetNotesRequestParams) =>
  useQuery<Note[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    select: (data) =>
      data.map((note) => ({ ...note, dateCreated: new Date(note.dateCreated), dateModified: new Date(note.dateModified) })),
    placeholderData: keepPreviousData,
  });
