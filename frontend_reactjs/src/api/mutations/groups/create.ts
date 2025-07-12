import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";
import { Group } from "../../../types";
import { useNavigate } from "react-router-dom";

export type CreateGroupRequestBody = {
  name: string;
  subject: string;
  location: string;
  time: Date;
  maxUsers?: number;
  notes?: string;
};

const createGroup = async (data: CreateGroupRequestBody) => {
  return await client
    .post("/groups", data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("createGroup-error", err?.response?.data);
      throw err?.response?.data;
    });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Group, AxiosError<{ message: string }>, CreateGroupRequestBody>({
    mutationFn: createGroup,
    onSuccess: (data) => {
      queryClient.refetchQueries({
        queryKey: ["groups"],
      });
      navigate("/");
    },
  });
};
