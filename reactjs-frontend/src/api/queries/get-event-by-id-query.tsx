import client from "../client";
import { useQuery } from "react-query";
import { Event } from "../../types";
import { useNavigate } from "react-router-dom";

const getEvents = (id?: string) => async () => {
  if (id)
    return await client
      .get("/events/" + id)
      .then((res) => res.data)
      .catch((e) => {
        console.error(e);
      });
};

export const useGetEventByIdQuery = (
  id?: string,
  isSearch: boolean = false
) => {
  const navigate = useNavigate();
  return useQuery<Event>(["get-event-by-id", id], getEvents(id), {
    onSuccess(data) {
      if (isSearch) {
        navigate("/event-planner_react/eventDetails", {
          state: { id: data._id },
        });
      }
    },
    enabled: !isSearch,
  });
};
