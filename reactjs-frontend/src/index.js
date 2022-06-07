import React from 'react';
import ReactDOM from 'react-dom';

import NavBarFooter from './components/NavBarFooter';
import Home from './components/Home'
import EventDetails from './components/EventDetails'
import CreateEvent from './components/CreateEvent'

import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Loader from 'react-loader-spinner';


function App() {

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

  const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0()

  if (isLoading) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
    </div>)

  else if (!isAuthenticated) loginWithRedirect()
  else return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/event-planner_react" />} ></Route>
        <Route exact path="/event-planner_react" element={<NavBarFooter />}>
          <Route exact path="" element={<Home BACKEND_URL={BACKEND_URL} />}></Route>
          <Route exact path="createEvent" element={<CreateEvent BACKEND_URL={BACKEND_URL} />}></Route>
          <Route exact path="eventDetails" element={<EventDetails BACKEND_URL={BACKEND_URL} />}></Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

function AppAuthenticator() {

  const domain = process.env.REACT_APP_AUTH0_DOMAIN
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={window.location.origin + '/event-planner_react'}>
      <App />
    </Auth0Provider>
  );
}

ReactDOM.render(<AppAuthenticator />,
  document.getElementById('root'));