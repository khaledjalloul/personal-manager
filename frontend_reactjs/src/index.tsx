import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme, UserContext, UserData } from "./utils";
import { useState } from "react";
import { Navigator } from "./navigation";
import client from "./api/client";
import { worker } from './mocks/browser'

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

async function enableMocking() {
  if (process.env.REACT_APP_MOCK_API !== "true")
    return
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
  ).render(<App />);
})