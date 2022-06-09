import React, { useState } from 'react';
import '../styles/navBarFooter.css';
import { MdEventNote } from 'react-icons/md'
import { RiArrowDropDownLine } from 'react-icons/ri'
import Hamburger from 'hamburger-react'
import useNavBarVisibility from '../assets/functions/useNavBarVisibility';

const NavBarElements = ({ children }) => children

const NavBarButton = ({ title, onClick }) => {
  const navBarElementsVisible = useNavBarVisibility()
  return <input type="button" value={title} className={navBarElementsVisible ? 'navBarElement' : 'navBarHamburgerElement'} onClick={onClick} />
}

const NavBarProfile = ({ title, image, children }) => {

  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false)
  const defaultImage = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg'

  return (
    <div className='navBarDropDownOuterContainer' onMouseEnter={() => setSelectMenuDisplayed(true)} onMouseLeave={() => setSelectMenuDisplayed(false)}>
      <button className={selectMenuDisplayed ? 'navBarElementHover' : 'navBarElement'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>{title}</p>
        <img src={image === 'default' ? defaultImage : image} alt="Profile" style={{ height: '37px', width: '37px', borderRadius: '20px', marginLeft: '10px' }} />
      </button>
      <div className='navBarDropDownInnerContainer' style={{ display: selectMenuDisplayed ? 'block' : 'none' }} >
        {React.Children.count(children) === 1 ?
          React.cloneElement(children, { className: 'navBarDropDownElement' }) :
          children.map(child => React.cloneElement(child, { className: 'navBarDropDownElement' }))}
      </div>
    </div>
  )
}

const NavBarDropDown = ({ title, children }) => {

  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false)
  const navBarElementsVisible = useNavBarVisibility()

  if (navBarElementsVisible) return (
    <div className='navBarDropDownOuterContainer' onMouseEnter={() => setSelectMenuDisplayed(true)} onMouseLeave={() => setSelectMenuDisplayed(false)}>
      <button className={selectMenuDisplayed ? 'navBarElementHover' : 'navBarElement'}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 'clamp(3px, 0.7vw, 12px)' }}>
        <p>{title}</p><RiArrowDropDownLine size={30} />
      </button>
      <div className='navBarDropDownInnerContainer' style={{ display: selectMenuDisplayed ? 'block' : 'none' }} >
        {React.Children.count(children) === 1 ?
          React.cloneElement(children, { className: 'navBarDropDownElement' }) :
          children.map(child => React.cloneElement(child, { className: 'navBarDropDownElement' }))}
      </div>
    </div>
  )
  else return (
    <div className='navBarDropDownOuterContainer'>
      <button className='navBarDropDownElement' onClick={() => setSelectMenuDisplayed(!selectMenuDisplayed)}>
        <p style={{ width: '100%', paddingLeft: '20px' }}>{title}</p>
        <RiArrowDropDownLine size={30} style={{ marginLeft: 'auto', height: '100%' }} />
      </button>
      <div className='navBarHamburgerDropDownContainer' style={{ display: selectMenuDisplayed ? 'block' : 'none' }} >
        {React.Children.count(children) === 1 ?
          React.cloneElement(children, { className: 'navBarHamburgerDropDownElement' }) :
          children.map(child => React.cloneElement(child, { className: 'navBarHamburgerDropDownElement' }))}
      </div>
    </div>
  )
}

const NavBarFooter = ({ title, onClick, children }) => {

  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const navBarElementsVisible = useNavBarVisibility()

  console.log(children)
  if (navBarElementsVisible) return (
    <div style={{ height: 'auto', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div id='navBar' style={{ justifyContent: 'flex-start' }}>
        <div id='navBarTitle' style={{ paddingLeft: 'clamp(25px, 5vw, 75px)' }}>
          <MdEventNote style={{ marginRight: '15px' }} />
          <p style={{ cursor: 'pointer' }} onClick={onClick}>Event Planner</p>
        </div>
        <div id='navBarElementsDiv'>
          {children.find(child => child.type.name === 'NavBarElements')}
          {children.find(child => child.type.name === 'NavBarProfile')}
        </div>
      </div>
      <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'stretch' }}>
        {children.find(child => child.type.name !== 'NavBarProfile' && child.type.name !== 'NavBarElements' && child.type.name !== 'Footer')}
      </div>
      {children.find(child => child.type.name === 'Footer')}
    </div>
  )
  else return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div id='navBar'>
        <div style={{ position: 'absolute', left: 'clamp(10px, 2vw, 20px)', height: '100%', display: 'flex', alignItems: 'center' }}>
          <Hamburger color='white' size={24} direction='right' toggled={hamburgerOpen} toggle={() => setHamburgerOpen(!hamburgerOpen)} />
        </div>
        <div id='navBarTitle'>
          <MdEventNote style={{ marginRight: '15px' }} />
          <p style={{ cursor: 'pointer' }} onClick={onClick}>{title}</p>
        </div>
        <div id='navBarElementsDiv'>
          {children.find(child => child.type.name === 'NavBarProfile')}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flex: '1 1 auto' }}>
        {children.find(child => child.type.name !== 'NavBarProfile' && child.type.name !== 'NavBarElements' && child.type.name !== 'Footer')}
        <div className= {hamburgerOpen ? 'navBarHamburgerContainer': 'navBarHamburgerContainerHidden'}>
          {React.Children.count(children.find(child => child.type.name === 'NavBarElements').props.children) === 1 ?
            children.find(child => child.type.name === 'NavBarElements') :
            children.find(child => child.type.name === 'NavBarElements').props.children}
        </div>
        {hamburgerOpen && <div style={{ position: 'absolute', height: '100%', width: '100vw', backgroundColor: 'rgba(50, 50, 50, 0.7)', zIndex: '1' }} onClick={() => setHamburgerOpen(false)} />}
      </div>
      {children.find(child => child.type.name === 'Footer')}
    </div>
  )
}

const Footer = ({ text, link }) => {
  return (
    <div id='footer'>
      <div id='footerCopyright'>
        <a href={link}>{text}</a>
      </div>
    </div>
  )
}

export { NavBarFooter, NavBarElements, NavBarButton, NavBarProfile, NavBarDropDown, Footer };
