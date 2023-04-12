import { useMutation } from "react-query";
import client from "../client";
import { useNavigate } from "react-router-dom";

const deleteEvent = (id: string) => async () => {
  return await client
    .delete(`events/${id}`)
    .then((res) => res.data)
    .catch((e) => console.error(e));
};

export const useDeleteEventMutation = (id: string) => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteEvent(id),
    onSuccess(data) {
      navigate("/event-planner_react");
    },
  });
};
