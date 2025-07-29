import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { JournalSection } from "../../../types";
import client from "../../client";

const ENDPOINT = "journal/sections";

export type GetJournalSectionsRequestParams = {
  categoryId?: number;
  searchText: string;
};

const queryFn = (params: GetJournalSectionsRequestParams) => async () => {
  const queryParams = Object.keys(params)
    .filter((key) => params[key as keyof GetJournalSectionsRequestParams] !== undefined)
    .map((key) => `${key}=${params[key as keyof GetJournalSectionsRequestParams]}`)
    .join("&");

  return await client
    .get(`/${ENDPOINT}?${queryParams}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useJournalSections = (params: GetJournalSectionsRequestParams) =>
  useQuery<JournalSection[]>({
    queryKey: [ENDPOINT, params],
    queryFn: queryFn(params),
    placeholderData: keepPreviousData,
  });
