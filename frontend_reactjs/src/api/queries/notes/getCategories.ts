import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { NoteCategory } from "../../../types";
import client from "../../client";

const ENDPOINT = "notes/categories";

const queryFn = async () => {
  return await client
    .get(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useNoteCategories = () =>
  useQuery<NoteCategory[]>({
    queryKey: [ENDPOINT],
    queryFn,
    placeholderData: keepPreviousData,
  });
