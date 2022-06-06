import React from 'react';
import '../styles/navBarFooter.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdEventNote } from 'react-icons/md'

const NavBar = (props) => {

  const navigate = useNavigate()
  const location = useLocation()

  var navBarElements = []

  if (props.token) {
    navBarElements = [
      <div className='navBarDropDown' key='My Events' >
        <input type="button" value='My Events' className='navBarElement'
          onClick={() => { if (location.pathname !== "/event-planner_react") navigate("/event-planner_react") }} />
      </div>,
      <div className='navBarDropDown' key='Create Event' >
        <input type="button" value='Create Event' className='navBarElement'
          onClick={() => { if (location.pathname !== "/event-planner_react/createEvent") navigate("/event-planner_react/createEvent") }} />
      </div>,
      <div className='navBarDropDown' key='Log out'>
        <input type="button" value='Log out' className='navBarElement'
          onClick={() => { props.setToken({}); navigate('/event-planner_react') }} />
      </div>
    ]
  }

  return (
    <div id='navBar' >
      <div id='navBarTitle'>
        <MdEventNote style={{ marginRight: '15px' }} />
        <p style={{ cursor: 'pointer' }} onClick={() => { if (location.pathname !== "/event-planner_react") navigate("/event-planner_react") }}>Event Planner</p>
      </div>
      <div id='navBarElementsDiv'>
        {navBarElements}
      </div>
    </div>
  )
}


const Footer = () => {
  return (
    <div id='footer'>
      <div id='footerCopyright'>
        <a href='https://github.com/khaledjalloul/event-planner_react'>GitHub Link: khaledjalloul/event-planner_react</a>
      </div>
    </div>
  )
}


const NavBarFooter = (props) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar token={props.token} setToken={props.setToken} />
      <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'stretch' }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

export default NavBarFooter;
