import { Auth } from "../pages";
import { UserContext } from "../utils";
import { useContext, useEffect } from "react";
import { NavigationBar } from "./NavigationBar";

export const Authenticator = () => {
  const { userData, setUserData } = useContext(UserContext);

  useEffect(() => {
    const localData = localStorage.getItem("userData");

    if (!localData) setUserData(null);
    else setUserData(JSON.parse(localData));
  }, []);

  // if (userData === undefined) return <div />;
  // else if (!userData) return <Auth />;
  return <NavigationBar />;
};
