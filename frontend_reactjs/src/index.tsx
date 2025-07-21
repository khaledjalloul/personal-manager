import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Theme, ThemeContext, ThemeData, UserContext, UserData } from "./utils";
import { useEffect, useState } from "react";
import { Navigator } from "./navigation";
import client from "./api/client";
import { worker } from './mocks/browser'
import { HttpStatusCode } from "axios";

const queryClient = new QueryClient();

const App = () => {
  const [userData, setUserData] = useState<UserData>();
  const [themeData, setThemeData] = useState<ThemeData>({ darkMode: true })
  const [mockReady, setMockReady] = useState(false);

  const contextData = {
    userData,
    setUserData: (userData?: UserData) => {
      if (!userData) {
        localStorage.removeItem("userData");
        setThemeData({ darkMode: false });
      }
      else {
        client.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData?.token}`;

        client.interceptors.response.use(
          (res) => res,
          (err) => {
            if (err?.response?.status === HttpStatusCode.Unauthorized) {
              localStorage.removeItem("userData");
              setUserData(null);
            } else throw err;
          }
        );
        setThemeData({ darkMode: true });
      }
      setUserData(userData);
    },
  };

  useEffect(() => {
    const waitForMock = async () => {
      if (process.env.REACT_APP_MOCK_API === "true")
        return worker.start()
    }
    waitForMock().then(() => {
      setMockReady(true);
    });
  }, []);

  return (
    <UserContext.Provider value={contextData}>
      <ThemeContext.Provider value={{ themeData, setThemeData }}>
        <QueryClientProvider client={queryClient}>
          <Theme themeData={themeData}>
            {mockReady ? <Navigator /> : <div />}
          </Theme>
        </QueryClientProvider>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
