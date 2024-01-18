import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { HamburgetMenuClose, HamburgetMenuOpen } from "./components/Icons";

function NavBar() {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);
  return(
    <>
      <nav className="navbar">
          <header className="logo"> 
            <a href="/">
              <img src="/nasdaq-logo.svg" alt="Nasdaq Logo" />
              </a>
          </header>
          <div className="hamburger-menu" onClick={handleClick}>
            {click ? <HamburgetMenuClose /> : <HamburgetMenuOpen />}
          </div>
        <div className={click ? "nav-container active" : "nav-container"}>
          <ul className={click ? "nav-menu" : "nav-menu"}>
            <li className="nav-item">
              <NavLink
                exact
                to="/"
                className="nav-links"
                onClick={handleClick}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/DisclosureTracking"
                className="nav-links"
                onClick={handleClick}
              >
                Disclosure Tracking
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/Entities"
                className="nav-links"
                onClick={handleClick}
              >
                Entities
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/ExchangeRates"
                className="nav-links"
                onClick={handleClick}
              >
                Exchange Rates
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                exact
                to="/Regulations"
                className="nav-links"
                onClick={handleClick}
              >
                Regulations
              </NavLink>
            </li>
          </ul>

        </div>
      </nav>
    </>
  );
}

export default NavBar;