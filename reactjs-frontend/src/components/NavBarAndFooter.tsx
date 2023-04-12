import React, { useState, Dispatch, ReactElement } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import Hamburger from "hamburger-react";
import useNavBarVisibility from "../assets/functions/useNavBarVisibility";
import { IconType } from "react-icons/lib";

const NavBarElements = ({ children }: { children: any }) => children;

const NavBarButton = ({
  title,
  onClick,
  setHamburgerOpen,
  active,
  icon,
}: {
  title: string;
  onClick: Function;
  setHamburgerOpen?: Dispatch<React.SetStateAction<boolean>>;
  active: boolean;
  icon: ReactElement<IconType>;
}) => {
  const navBarElementsVisible = useNavBarVisibility();
  return (
    <button
      className={
        navBarElementsVisible
          ? active
            ? "navBarElementHover"
            : "navBarElement"
          : "navBarHamburgerElement"
      }
      onClick={() => {
        onClick();
        if (!navBarElementsVisible) setHamburgerOpen!(false);
      }}
    >
      {!navBarElementsVisible && (
        <div style={{ marginRight: "10px" }}>{icon}</div>
      )}
      {title}
    </button>
  );
};

const NavBarProfile = ({
  title,
  image,
  children,
}: {
  title?: string;
  image: string;
  children: any;
}) => {
  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false);
  const defaultImage =
    "https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg";

  return (
    <div
      className="navBarDropDownOuterContainer"
      onMouseEnter={() => setSelectMenuDisplayed(true)}
      onMouseLeave={() => setSelectMenuDisplayed(false)}
      onClick={() => setSelectMenuDisplayed(true)}
    >
      <button
        className={
          selectMenuDisplayed ? "navBarElementHover" : "navBarElement"
        }
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>{title}</p>
        <img
          src={image === "default" ? defaultImage : image}
          alt="Profile"
          style={{
            height: "37px",
            width: "37px",
            borderRadius: "20px",
            marginLeft: "10px",
          }}
        />
      </button>
      <div
        className="navBarDropDownInnerContainer"
        style={{ display: selectMenuDisplayed ? "block" : "none" }}
      >
        {React.Children.count(children) === 1
          ? React.cloneElement(children, { className: "navBarDropDownElement" })
          : children.map((child: any) =>
              React.cloneElement(child, { className: "navBarDropDownElement" })
            )}
      </div>
    </div>
  );
};

const NavBarDropDown = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
  const navBarElementsVisible = useNavBarVisibility();
  const [selectMenuDisplayed, setSelectMenuDisplayed] = useState(false);

  if (navBarElementsVisible)
    return (
      <div
        className="navBarDropDownOuterContainer"
        onMouseEnter={() => setSelectMenuDisplayed(true)}
        onMouseLeave={() => setSelectMenuDisplayed(false)}
        onClick={() => setSelectMenuDisplayed(true)}
      >
        <button
          className={
            selectMenuDisplayed ? "navBarElementHover" : "navBarElement"
          }
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight: "clamp(3px, 0.7vw, 12px)",
          }}
        >
          <p>{title}</p>
          <RiArrowDropDownLine size={30} />
        </button>
        <div
          className="navBarDropDownInnerContainer"
          style={{ display: selectMenuDisplayed ? "block" : "none" }}
        >
          {React.Children.count(children) === 1
            ? React.cloneElement(children, {
                className: "navBarDropDownElement",
              })
            : children.map((child: any) =>
                React.cloneElement(child, {
                  className: "navBarDropDownElement",
                })
              )}
        </div>
      </div>
    );
  else
    return (
      <div className="navBarDropDownOuterContainer">
        <p className="navBarHamburgerDropDownTitle">{title}</p>
        <div className="navBarHamburgerDropDownContainer">
          {React.Children.count(children) === 1
            ? React.cloneElement(children, {
                className: "navBarHamburgerDropDownElement",
              })
            : children.map((child: any) =>
                React.cloneElement(child, {
                  className: "navBarHamburgerDropDownElement",
                })
              )}
        </div>
      </div>
    );
};

const NavBarAndFooter = ({
  title,
  icon,
  onClick,
  children,
}: {
  title: string;
  icon: ReactElement<IconType>;
  onClick: () => void;
  children: any;
}) => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const navBarElementsVisible = useNavBarVisibility();

  if (navBarElementsVisible)
    return (
      <div
        style={{
          height: "auto",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div id="navBar" style={{ justifyContent: "flex-start" }}>
          <div
            id="navBarTitle"
            style={{ paddingLeft: "clamp(25px, 5vw, 75px)" }}
          >
            {navBarElementsVisible && (
              <div
                style={{
                  marginRight: "15px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {icon}
              </div>
            )}
            <p style={{ cursor: "pointer" }} onClick={onClick}>
              {title}
            </p>
          </div>
          <div className="navBarElementsDiv">
            {children.find(
              (child: any) => child.type.name === NavBarElements.name
            )}
            {children.find(
              (child: any) => child.type.name === NavBarProfile.name
            )}
          </div>
        </div>
        <div
          style={{ display: "flex", flex: "1 1 auto", alignItems: "stretch" }}
        >
          {children.find(
            (child: any) =>
              child.type.name !== NavBarProfile.name &&
              child.type.name !== NavBarElements.name &&
              child.type.name !== Footer.name
          )}
        </div>
        {children.find((child: any) => child.type.name === Footer.name)}
      </div>
    );
  else
    return (
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div id="navBar">
          <div
            style={{ height: "100%", display: "flex", alignItems: "center" }}
          >
            <Hamburger
              color="white"
              size={20}
              direction="right"
              toggled={hamburgerOpen}
              toggle={() => setHamburgerOpen(!hamburgerOpen)}
            />
          </div>
          <div id="navBarTitle">
            {navBarElementsVisible && (
              <div style={{ marginRight: "15px" }}>{icon}</div>
            )}
            <p style={{ cursor: "pointer" }} onClick={onClick}>
              {title}
            </p>
          </div>
          <div className="navBarElementsDiv">
            {children.find(
              (child: any) => child.type.name === NavBarProfile.name
            )}
          </div>
        </div>
        <div
          style={{ position: "relative", display: "flex", flex: "1 1 auto" }}
        >
          {children.find(
            (child: any) =>
              child.type.name !== NavBarProfile.name &&
              child.type.name !== NavBarElements.name &&
              child.type.name !== Footer.name
          )}
          <div
            className={
              hamburgerOpen
                ? "navBarHamburgerContainer"
                : "navBarHamburgerContainerHidden"
            }
          >
            {React.Children.count(
              children.find(
                (child: any) => child.type.name === NavBarElements.name
              ).props.children
            ) === 1
              ? React.cloneElement(
                  children.find(
                    (child: any) => child.type.name === NavBarElements.name
                  ).props.children,
                  { setHamburgerOpen: setHamburgerOpen }
                )
              : children
                  .find((child: any) => child.type.name === NavBarElements.name)
                  .props.children.map((child: any) =>
                    React.cloneElement(child, {
                      setHamburgerOpen: setHamburgerOpen,
                    })
                  )}
          </div>
          {hamburgerOpen && (
            <div
              style={{
                position: "absolute",
                height: "100%",
                width: "100vw",
                backgroundColor: "rgba(50, 50, 50, 0.7)",
                zIndex: 1,
              }}
              onClick={() => setHamburgerOpen(false)}
            />
          )}
        </div>
        {children.find((child: any) => child.type.name === Footer.name)}
      </div>
    );
};

const Footer = ({ text, link }: { text: string; link: string }) => {
  return (
    <div id="footer">
      <div id="footerCopyright">
        <a href={link}>{text}</a>
      </div>
    </div>
  );
};

export {
  NavBarAndFooter,
  NavBarElements,
  NavBarButton,
  NavBarProfile,
  NavBarDropDown,
  Footer,
};
