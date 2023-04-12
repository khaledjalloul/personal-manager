import { useMutation } from "react-query";
import client from "../client";
import { useNavigate } from "react-router-dom";

type Request = {
  title: string;
  location: string;
  dateTime: string;
  image: string;
  items: string[];
  description: string;
  creatorName: string;
  creatorID: string;
};

const createEvent = async (props: Request) => {
  return await client
    .post("events", props)
    .then((res) => res.data)
    .catch((e) => console.error(e));
};

export const useCreateEventMutation = () => {
  const navigate = useNavigate();
  return useMutation<unknown, unknown, Request>({
    mutationFn: createEvent,
    onSuccess(data) {
      navigate("/event-planner_react");
    },
  });
};
