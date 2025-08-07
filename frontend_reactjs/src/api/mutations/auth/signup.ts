import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { AxiosError } from "axios";

type Request = {
  name: string;
  email: string;
  password: string;
};

type Response = {
  userId: number;
  name: string;
  email: string;
  token: string;
};

const signUp = async (data: Request) => {
  return await client
    .post("/auth/signup", data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("signUp-error", err?.response?.data);
      throw err;
    });
};

export const useSignUp = () => useMutation<Response, AxiosError<{ message: string }>, Request>({
  mutationFn: signUp,
});
