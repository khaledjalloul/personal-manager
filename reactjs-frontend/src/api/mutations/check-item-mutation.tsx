import { useMutation, useQueryClient } from "react-query";
import client from "../client";
import { Event } from "../../types";

type Request = {
  item: string;
  available: boolean;
};

const checkItem = (eventId?: string) => async (props: Request) => {
  console.log(eventId);
  return await client
    .patch(`events/checkItem/${eventId}`, props)
    .then((res) => res.data)
    .catch((e) => console.error(e));
};

export const useCheckItemMutation = (event?: Event) => {
  const queryClient = useQueryClient();
  return useMutation<unknown, unknown, Request>({
    mutationFn: checkItem(event?._id),
    onSuccess(data) {
      queryClient.refetchQueries(["get-event-by-id", event?._id]);
    },
    onMutate(variables) {
      if (event)
        queryClient.setQueryData(["get-event-by-id", event?._id], {
          ...event,
          items: event?.items.map((item) => {
            if (item.name === variables.item) {
              return {
                name: item.name,
                available: variables.available,
              };
            } else return item;
          }),
        });
    },
  });
};
