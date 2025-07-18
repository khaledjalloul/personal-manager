import { useMutation } from "@tanstack/react-query";
import client from "../../client";
import { useContext } from "react";
import { UserContext } from "../../../utils";
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
  console.log("signUp", data);
  return await client
    .post("/auth/signup", data)
    .then((res) => res.data)
    .catch((err) => {
      console.error("signUp-error", err?.response?.data);
      throw err?.response?.data;
    });
};

export const useSignUp = () => {
  const { setUserData } = useContext(UserContext);

  return useMutation<Response, AxiosError<{ message: string }>, Request>({
    mutationFn: signUp,
    onSuccess: (data) => {
      if (data) {
        setUserData(data);
        localStorage.setItem("userData", JSON.stringify(data));
      }
    },
  });
};
