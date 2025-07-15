import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ExpensesCategory } from "../../../types";
import client from "../../client";

const ENDPOINT = "expenses/categories";


const queryFn = () => async () => {
  return await client
    .get(`/${ENDPOINT}`)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useExpensesCategories = () =>
  useQuery<ExpensesCategory[]>({
    queryKey: [ENDPOINT],
    queryFn: queryFn(),
    placeholderData: keepPreviousData,
  });
