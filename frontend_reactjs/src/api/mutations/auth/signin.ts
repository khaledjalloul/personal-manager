import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { useContext } from "react";
import { ThemeContext, UserContext } from "../../../utils";
import { AxiosError } from "axios";

type Request = {
  email: string;
  password: string;
};

type Response = {
  userId: number;
  name: string;
  email: string;
  token: string;
};

const signIn = async (data: Request) => {
  return await client
    .post("/auth/signin", data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("signIn-error", err?.response?.data);
      throw err;
    });
};

export const useSignIn = () => {
  const { setUserData } = useContext(UserContext);
  const { setThemeData } = useContext(ThemeContext);

  return useMutation<Response, AxiosError<{ message: string }>, Request>({
    mutationFn: signIn,
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
        setThemeData({ darkMode: true });
      }
    },
  });
};
