import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import Home from './components/Home'
import CreateEvent from './components/CreateEvent'
import EventDetails from './components/EventDetails'

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import NavBarFooter from './components/NavBarFooter';

function App() {
  return (
    <Router>
      <NavBarFooter>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/createEvent" element={<CreateEvent />}></Route>
          <Route exact path="/eventDetails" element={<EventDetails />}></Route>
        </Routes>
      </NavBarFooter>
    </Router>
  );
}

ReactDOM.render(<App />,
  document.getElementById('root'));