import '../styles/headerFooter.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Hamburger from 'hamburger-react';

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
  var navBarElements = [
    new NavBarElement("My Events", 'button', () => { if (location.pathname !== "/") navigate("/") }),
    new NavBarElement("Create Event", 'button', () => { if (location.pathname !== "/createEvent") navigate("/createEvent") }),
  ]

  var icon = <div></div>
  // icon = <img src={} alt="icon" style={{ height: '40px', marginRight: '15px' }} />

  navBarElements.map((navBarElement, index) => {

    if (navBarElement.type === "button")

      output.push(
        <div className={navBarElementsVisible ? 'headerFooter_dropDown' : 'headerFooter_hamburgerDropDown'}>
          <input type="button" value={navBarElement.name} onClick={navBarElement.func} className={navBarElementsVisible ? 'headerFooter_navBarElement' : 'headerFooter_hamburgerNavBarElement'} />
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
    <div className='headerFooter_navBar' >
      <div className='headerFooter_title' ref={titleRef}>{icon}<p style={{cursor: 'pointer'}} onClick={() => { if (location.pathname !== "/") navigate("/") }}>Event Planner</p></div>
      <div className='headerFooter_navBarElementsDiv' ref={navBarRef}>
        {navBarElementsVisible ?
          output :
          <div className='headerFooter_dropDown'>
            <div style={{ height: '60px', display: 'flex', alignItems: 'center' }}>
              <Hamburger color='white' size={24} direction='right' toggled={displayHamburgerDiv} toggle={() => setDisplayHamburgerDiv(!displayHamburgerDiv)} />
            </div>
            <div className='headerFooter_dropDownContainer' style={{ visibility: displayHamburgerDiv ? 'visible' : 'hidden', opacity: displayHamburgerDiv ? '1' : '0' }}>{output}</div>
          </div>}
      </div>
    </div>
  )
}


const Footer = () => {
  return (
    <div className='headerFooter_footer'>
      <div className='headerFooter_copyright'>
        <a href='https://github.com/khaledjalloul/event-planner_react'>GitHub Link: khaledjalloul/event-planner_react</a>
      </div>
    </div>
  )
}


const HeaderFooter = (props) => {
  return (
    <div style={{height: '100%'}}>
      <NavBar />
      <div style={{ height: 'calc(100vh - 110px)', maxWidth: '100vw' }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
}

export default HeaderFooter;
