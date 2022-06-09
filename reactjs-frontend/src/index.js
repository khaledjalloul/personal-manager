import React from 'react';
import ReactDOM from 'react-dom';

import Home from './components/Home'
import MyEvents from './components/MyEvents'
import EventDetails from './components/EventDetails'
import CreateEvent from './components/CreateEvent'

import { HashRouter, Routes, Route, Navigate } from "react-router-dom"
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'
import Loader from 'react-loader-spinner';


function App() {

  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader type="TailSpin" color="#004b7d" height='10vh' width='15vw' />
    </div>)

  else if (!isAuthenticated) loginWithRedirect()
  else return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/event-planner_react" />} ></Route>
        <Route exact path="/event-planner_react" element={<Home />}>
          <Route exact path="" element={<MyEvents />}></Route>
          <Route exact path="createEvent" element={<CreateEvent />}></Route>
          <Route exact path="eventDetails" element={<EventDetails />}></Route>
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