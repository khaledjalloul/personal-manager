import '../styles/navBarFooter.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';
import {MdEventNote} from 'react-icons/md'

class NavBarElement {
  constructor(name, type, func) {
    this.name = name
    this.type = type
    this.func = func
  }
}

const NavBar = () => {
  const [navBarElementsVisible, setNavBarElementsVisible] = useState(true)
  const [lastKnownWidth, setLastKnownWidth] = useState(0)
  const [displayHamburgerDiv, setDisplayHamburgerDiv] = useState(false)

  const titleRef = React.createRef()
  const navBarRef = React.createRef()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof titleRef !== 'undefined' && typeof navBarRef !== 'undefined') {
        if (titleRef.current !== null && titleRef.current !== null)
          if (navBarElementsVisible && window.innerWidth - titleRef.current.offsetWidth < navBarRef.current.offsetWidth) {
            setLastKnownWidth(navBarRef.current.offsetWidth)
            setNavBarElementsVisible(false)
          } else if (window.innerWidth - titleRef.current.offsetWidth > lastKnownWidth) {
            setNavBarElementsVisible(true)
          }
      }
    }, 10);

    return () => {
      clearInterval(interval);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  var output = []
  var navBarElements = []

  if (localStorage.getItem('token')) {
    navBarElements = [
      new NavBarElement("My Events", 'button', () => { if (location.pathname !== "/") navigate("/") }),
      new NavBarElement("Create Event", 'button', () => { if (location.pathname !== "/createEvent") navigate("/createEvent") }),
      new NavBarElement("Log out", 'button', () => { localStorage.removeItem('token'); window.location.reload(false) }),
    ]
  }

  var icon = <MdEventNote style={{ marginRight: '15px' }} />

  navBarElements.map((navBarElement, index) => {

    if (navBarElement.type === "button")

      output.push(
        <div className={navBarElementsVisible ? 'navBarDropDown' : 'navBarHamburgerDropDown'} key={navBarElement.name}>
          <input type="button" value={navBarElement.name} onClick={navBarElement.func} className={navBarElementsVisible ? 'navBarElement' : 'navBarHamburgerElement'} />
        </div>)

    // if (navBarElement.type === "select") {
    //   output.push(
    //     <div className={navBarElementsVisible ? 'headerFooter_dropDown' : 'headerFooter_hamburgerDropDown'} onMouseEnter={() => setState({ ['select' + index + 'Displayed']: true })} onMouseLeave={() => setState({ ['select' + index + 'Displayed']: false })}>
    //       <input type='button' className={navBarElementsVisible ? state['select' + index + 'Displayed'] ? 'headerFooter_navBarElementHover' : 'headerFooter_navBarElement' : 'headerFooter_hamburgerNavBarElement'} value={navBarElementsVisible ? navBarElement.name + '' : '◄ ' + navBarElement.name} />
    //       <div className={navBarElementsVisible ? 'headerFooter_dropDownContainer' : 'headerFooter_hamburgerDropDownContainer'} style={{ visibility: state['select' + index + 'Displayed'] ? 'visible' : 'hidden', opacity: state['select' + index + 'Displayed'] ? '1' : '0' }}>
    //         {navBarElement.func}
    //       </div>
    //     </div>)
    // }

    return navBarElement
  })

  return (
    <div id='navBar' >
      <div id='navBarTitle' ref={titleRef}>{icon}<p style={{ cursor: 'pointer' }} onClick={() => { if (location.pathname !== "/") navigate("/") }}>Event Planner</p></div>
      <div id='navBarElementsDiv' ref={navBarRef}>
        {navBarElementsVisible ?
          output :
          <div className='navBarDropDown'>
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <Hamburger color='white' size={24} direction='right' toggled={displayHamburgerDiv} toggle={() => setDisplayHamburgerDiv(!displayHamburgerDiv)} />
            </div>
            <div id='navBarDropDownContainer' style={{ visibility: displayHamburgerDiv ? 'visible' : 'hidden', opacity: displayHamburgerDiv ? '1' : '0' }}>{output}</div>
          </div>}
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
      <NavBar />
      <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'stretch' }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

export default NavBarFooter;
