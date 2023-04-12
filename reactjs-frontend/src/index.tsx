import React from "react";
import ReactDOM from "react-dom";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import Loader from "react-loader-spinner";
import { CreateEvent, EventDetails, Home, MyEvents } from "./pages";
import { QueryClient, QueryClientProvider } from "react-query";
import "./styles/createEvent.css"
import "./styles/DateTimePicker.css"
import "./styles/eventDetails.css"
import "./styles/login.css"
import "./styles/myEvents.css"
import "./styles/navBarFooter.css"
import "./styles/notifications.css"

function App() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading)
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Loader type="TailSpin" color="#004b7d" height="10vh" width="15vw" />
      </div>
    );
  else if (!isAuthenticated) {
    loginWithRedirect();
    return <div></div>;
  } else
    return (
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/event-planner_react" />}
          ></Route>
          <Route path="/event-planner_react" element={<Home />}> 
            <Route path="" element={<MyEvents />}></Route>
            <Route path="createEvent" element={<CreateEvent />}></Route>
            <Route path="eventDetails" element={<EventDetails />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    );
}

function AppAuthenticator() {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  const queryClient = new QueryClient()
  return (
    <Auth0Provider
      domain={domain!}
      clientId={clientId!}
      redirectUri={window.location.origin + "/event-planner_react"}
    >
      <QueryClientProvider client={queryClient} >
      <App />
      </QueryClientProvider>
    </Auth0Provider>
  );
}

ReactDOM.render(<AppAuthenticator />, document.getElementById("root"));
