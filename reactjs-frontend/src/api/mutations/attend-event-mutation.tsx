import { useMutation, useQueryClient } from "react-query";
import client from "../client";

type Request = {
  userID?: string;
  username?: string;
  unAttend?: boolean;
};

const attendEvent = (id: string) => async (props: Request) => {
  return await client
    .patch("events/" + (props.unAttend ? "unAttend/" : "attend/") + id, props)
    .then((res) => res.data)
    .catch((e) => console.error(e));
};

export const useAttendEventMutation = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Request>({
    mutationFn: attendEvent(id),
    onSuccess(data) {
      queryClient.refetchQueries(["get-event-by-id", id]);
    },
  });
};
