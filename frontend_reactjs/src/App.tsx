import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme, UserContext, UserData } from "./utils";
import { useState } from "react";
import { Navigator } from "./navigation";
import client from "./api/client";

const queryClient = new QueryClient();

const App = () => {
  const [userData, setUserData] = useState<UserData>();

  const contextData = {
    userData,
    setUserData: (userData?: UserData) => {
      if (!userData) localStorage.removeItem("userData");
      else {
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData?.token}`;

        client.interceptors.response.use(
          (res) => res,
          (err) => {
            if (err?.response?.status === 401) {
              localStorage.removeItem("userData");
              setUserData(null);
            } else throw err;
          }
        );
      }
      setUserData(userData);
    },
  };
  return (
    <UserContext.Provider value={contextData}>
      <QueryClientProvider client={queryClient}>
        <Theme>
          <Navigator />
        </Theme>
      </QueryClientProvider>
    </UserContext.Provider>
  );
};

export default App;
