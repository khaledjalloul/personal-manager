import React from 'react';
import ReactDOM from 'react-dom';
import './styles/home.css';
import './styles/eventDetails.css';
import './styles/createEvent.css';
import './styles/DateTimePicker.css';
import './styles/navBarFooter.css';
import './styles/login.css';
import Home from './components/Home'
import Login from './components/Login'
import CreateEvent from './components/CreateEvent'
import EventDetails from './components/EventDetails'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBarFooter from './components/NavBarFooter';
import useToken from './assets/functions/useToken';

function App() {

  const { token, setToken } = useToken()

  // const APIURL = 'http://localhost:5000'
  const APIURL = 'https://event-planner-express.herokuapp.com'

  return (
    <Router>
      <NavBarFooter>
        {!token ? <Login setToken={setToken} APIURL={APIURL}  /> :
          <Routes>
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