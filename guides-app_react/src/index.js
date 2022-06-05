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

  return (
    <Router>
      <NavBarFooter>
        {!token ? <Login setToken={setToken} /> :
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/createEvent" element={<CreateEvent />}></Route>
          <Route exact path="/eventDetails" element={<EventDetails />}></Route>
        </Routes>}
      </NavBarFooter>
    </Router>
  );
}

ReactDOM.render(<App />,
  document.getElementById('root'));