import { UserAuth } from "../firebase/AuthContext";
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from "react";
import '../App.css';

function NavBar({ onColorSchemeChange, colorScheme }) {
  const { user, logOutUser } = UserAuth();
  const [mode, setMode] = useState(colorScheme);

  const [web, setWeb] = useState(false);
  const toggleMode = () => {
    
    setMode(mode === 'light' ? 'dark' : 'light');
  };
  useEffect(()=>{
  if(navigator.userAgent.includes('Mac')&&!navigator.userAgent.includes('iPhone')||navigator.userAgent.includes('Windows')){
    setWeb(true)
  }
  },[])
  return (

    <div className='Nav' >
      {user && (
        <Navbar bg="light" expand="lg">
        <Container fluid>
          <Navbar.Brand href="/">Cover Letter Generator 4000</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              navbarScroll
            >
               {/*For Small screens */}
              <div className="d-lg-none">
                <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/newcover">New Cover Letter</Nav.Link>
                <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/pastcover">Past Cover Letters</Nav.Link>
                <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/userprofile">User Profile</Nav.Link>
              </div>
              {/*For Large screens */}
              <div className="d-none d-lg-block"> 
                <div className="d-flex align-items-center">
                  <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/newcover">New Cover Letter</Nav.Link>
                  <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/pastcover">Past Cover Letters</Nav.Link>
                  <Nav.Link className={web ? "nav-web" : ""} colorScheme={mode} href="/userprofile">User Profile</Nav.Link>
                </div>
              </div>
            </Nav>
            <button className="logout" onClick={logOutUser}>Logout</button>
            {(<div>
              <button className="mode-switch" onClick={() => { onColorSchemeChange(); toggleMode() }}>
                {mode === 'light' ? '🌞' : '🌙'}
              </button>
            </div>)}
          </Navbar.Collapse>
        </Container>
      </Navbar>
      )}
      {!user && (
      <Navbar bg="light" expand="lg" >
        <Navbar.Brand colorScheme={mode} href="/">Cover Letter Generator 4000</Navbar.Brand>
        {!web && (<div> <button className="mode-switch" onClick={() => {onColorSchemeChange(); toggleMode()}}>
            {mode === 'light' ? '🌞' : '🌙'}
          </button></div>)}

        {!user && (
          <Nav className={"no-user "+(web?"no-user-web":"")}>
            <Nav.Link colorScheme={mode} href="/signin">Login</Nav.Link>
            <Nav.Link className="mg" colorScheme={mode} href="/signup">Sign Up</Nav.Link>
          </Nav>
          
        )}
        
      </Navbar>
      )}
    </div>
  );
}

export default NavBar;
