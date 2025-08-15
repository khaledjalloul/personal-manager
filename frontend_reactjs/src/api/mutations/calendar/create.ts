import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { CalendarEntry } from "../../../types";

const ENDPOINT = "calendar";

export type CreateCalendarEntryRequestBody = {
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date;
  repeatUntilDate?: Date;
};

const mutationFn = async (data: CreateCalendarEntryRequestBody) => {
  return await client
    .post(`/${ENDPOINT}`, data)
    .then((res) => res.data)
    .catch((err) => {
      console.error(`create-${ENDPOINT}-error`, err?.response?.data);
      throw err;
    });
};

export const useCreateCalendarEntry = () => {
  const queryClient = useQueryClient();

  return useMutation<CalendarEntry[], AxiosError<{ message: string }>, CreateCalendarEntryRequestBody>({
    mutationFn,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: [ENDPOINT],
      });
    },
  });
};
