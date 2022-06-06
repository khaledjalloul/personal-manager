import React from 'react';
import ReactDOM from 'react-dom';

import useToken from './assets/functions/useToken';
import NavBarFooter from './components/NavBarFooter';
import Login from './components/Login'
import Home from './components/Home'
import EventDetails from './components/EventDetails'
import CreateEvent from './components/CreateEvent'

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

function App() {

  const { token, setToken } = useToken()

  const APIURL = 'http://localhost:3737'
  // const APIURL = 'https://event-planner-express.herokuapp.com'

  return (
    <Router>
    <NavBarFooter token={token} setToken={setToken}>
        {!token ? <Login setToken={setToken} APIURL={APIURL}  /> :
          <Routes>
            <Route exact path='/' element={<Navigate to='/event-planner_react' />} />
            <Route exact path="/event-planner_react" element={<Home APIURL={APIURL} />}></Route>
            <Route exact path="/event-planner_react/createEvent" element={<CreateEvent APIURL={APIURL} />}></Route>
            <Route exact path="/event-planner_react/eventDetails" element={<EventDetails APIURL={APIURL} />}></Route>
          </Routes>}
      </NavBarFooter>
    </Router>
  );
}

ReactDOM.render(<App />,
  document.getElementById('root'));