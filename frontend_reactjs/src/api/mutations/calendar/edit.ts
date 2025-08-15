import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { CalendarEntry } from "../../../types";

const ENDPOINT = "calendar";

export type EditCalendarEntryRequestBody = {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
};

const mutationFn = async (data: EditCalendarEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}/${data.id}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`edit-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useEditCalendarEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<CalendarEntry, AxiosError<{ message: string }>, EditCalendarEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
