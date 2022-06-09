import React from 'react';
import '../styles/navBarFooter.css';
import { NavBarFooter, NavBarElements, NavBarButton, NavBarDropDown, NavBarProfile, Footer } from './NavBarFooter'
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Home = () => {

  const { logout, user } = useAuth0()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <NavBarFooter title="Event Planner"
      onClick={() => { if (location.pathname !== "/event-planner_react") navigate("/event-planner_react") }}>
      <NavBarElements >
        <NavBarButton title='My Events'
          onClick={() => {
            if (location.pathname !== "/event-planner_react")
              navigate("/event-planner_react")
          }} />
        <NavBarButton title='Create Event'
          onClick={() => {
            if (location.pathname !== "/event-planner_react/createEvent")
              navigate("/event-planner_react/createEvent")
          }} />
        <NavBarDropDown title='events'>
          <button>test</button>
        </NavBarDropDown>
      </NavBarElements>
      <NavBarProfile title={user.nickname} image={user.picture ? user.picture : 'default'} >
        <button onClick={() => {
          logout({ returnTo: window.location.origin + '/event-planner_react' })
        }} >
          Log out
        </button>
      </NavBarProfile>
      <Outlet />
      <Footer text="GitHub Link: khaledjalloul/event-planner_react" link="https://github.com/khaledjalloul/event-planner_react" />
    </NavBarFooter>
  );
}

export default Home;
