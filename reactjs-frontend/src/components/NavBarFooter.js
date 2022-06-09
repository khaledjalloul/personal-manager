import React, { useState } from 'react';
import '../styles/navBarFooter.css';
import { RiArrowDropDownLine } from 'react-icons/ri'
import Hamburger from 'hamburger-react'
import useNavBarVisibility from '../assets/functions/useNavBarVisibility';

const NavBarElements = ({ children }) => children

const NavBarButton = ({ title, onClick, setHamburgerOpen }) => {
  const navBarElementsVisible = useNavBarVisibility()
  return <input type="button" value={title} className={navBarElementsVisible ? 'navBarElement' : 'navBarHamburgerElement'} onClick={() => { onClick(); if (!navBarElementsVisible) setHamburgerOpen(false) }} />
}

const NavBarProfile = ({ title, image, children }) => {

  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false)
  const defaultImage = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg'

  return (
    <div className='navBarDropDownOuterContainer' onMouseEnter={() => setSelectMenuDisplayed(true)} onMouseLeave={() => setSelectMenuDisplayed(false)} onClick={() => setSelectMenuDisplayed(true)}>
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

  const navBarElementsVisible = useNavBarVisibility()
  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false)

  if (navBarElementsVisible) return (
    <div className='navBarDropDownOuterContainer' onMouseEnter={() => setSelectMenuDisplayed(true)} onMouseLeave={() => setSelectMenuDisplayed(false)} onClick={() => setSelectMenuDisplayed(true)}>
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
      <button className='navBarHamburgerElement' onClick={() => setSelectMenuDisplayed(!selectMenuDisplayed)}>
        <p>{title}</p>
        <RiArrowDropDownLine size={30} style={{ position: 'absolute', right: '20px' }} />
      </button>
      <div className='navBarHamburgerDropDownContainer' style={{ display: selectMenuDisplayed ? 'block' : 'none' }} >
        {React.Children.count(children) === 1 ?
          React.cloneElement(children, { className: 'navBarHamburgerDropDownElement' }) :
          children.map(child => React.cloneElement(child, { className: 'navBarHamburgerDropDownElement' }))}
      </div>
    </div>
  )
}

const NavBarFooter = ({ title, icon, onClick, children }) => {

  const [hamburgerOpen, setHamburgerOpen] = useState(false)
  const navBarElementsVisible = useNavBarVisibility()

  if (navBarElementsVisible) return (
    <div style={{ height: 'auto', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      <div id='navBar' style={{ justifyContent: 'flex-start' }}>
        <div id='navBarTitle' style={{ paddingLeft: 'clamp(25px, 5vw, 75px)' }}>
          {navBarElementsVisible && <div style={{ marginRight: '15px' }}>{icon}</div>}
          <p style={{ cursor: 'pointer' }} onClick={onClick}>{title}</p>
        </div>
        <div className='navBarElementsDiv'>
          {children.find(child => child.type.name === NavBarElements.name)}
          {children.find(child => child.type.name === NavBarProfile.name)}
        </div>
      </div>
      <div style={{ display: 'flex', flex: '1 1 auto', alignItems: 'stretch' }}>
        {children.find(child => child.type.name !== NavBarProfile.name && child.type.name !== NavBarElements.name && child.type.name !== Footer.name)}
      </div>
      {children.find(child => child.type.name === Footer.name)}
    </div>
  )
  else return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div id='navBar'>
        <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
          <Hamburger color='white' size={20} direction='right' toggled={hamburgerOpen} toggle={() => setHamburgerOpen(!hamburgerOpen)} />
        </div>
        <div id='navBarTitle'>
          {navBarElementsVisible && <div style={{ marginRight: '15px' }}>{icon}</div>}
          <p style={{ cursor: 'pointer' }} onClick={onClick}>{title}</p>
        </div>
        <div className='navBarElementsDiv'>
          {children.find(child => child.type.name === NavBarProfile.name)}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flex: '1 1 auto' }}>
        {children.find(child => child.type.name !== NavBarProfile.name && child.type.name !== NavBarElements.name && child.type.name !== Footer.name)}
        <div className={hamburgerOpen ? 'navBarHamburgerContainer' : 'navBarHamburgerContainerHidden'}>
          <div style={{ backgroundColor: 'rgba(0, 75, 125, 0.9)', height: 'calc(100% + 1px)', width: 'calc(100% + 1px)' }}>
            {React.Children.count(children.find(child => child.type.name === NavBarElements.name).props.children) === 1 ?
              React.cloneElement(children.find(child => child.type.name === NavBarElements.name).props.children, { setHamburgerOpen: setHamburgerOpen }) :
              children.find(child => child.type.name === NavBarElements.name).props.children.map(child => React.cloneElement(child, { setHamburgerOpen: setHamburgerOpen }))}
          </div>
        </div>
        {hamburgerOpen && <div style={{ position: 'absolute', height: '100%', width: '100vw', backgroundColor: 'rgba(50, 50, 50, 0.7)', zIndex: '1' }} onClick={() => setHamburgerOpen(false)} />}
      </div>
      {children.find(child => child.type.name === Footer.name)}
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
