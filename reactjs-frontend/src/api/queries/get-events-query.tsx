import client from "../client";
import { useQuery } from "react-query";
import { Event } from "../../types";

const getEvents = (sub?: string) => async () => {
  if (sub)
    return await client
      .get(`/events/?userID=${sub}`)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
};

export const useGetEventsQuery = (sub?: string) =>
  useQuery<Event[]>("get-events", getEvents(sub));
