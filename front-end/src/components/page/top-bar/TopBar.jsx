import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const TopBar = ({ title }) => {
  const [username, setUsername] = useState('Utente');
  const history = useHistory();

  useEffect(() => {
    setUsername(sessionStorage.getItem('username') || 'Utente');
  }, []);

  const logout = useCallback(async () => {
    // TODO: logout
    history.push('/login');
  }, [history]);

  return (
    <Navbar sticky="top" className="bg-white topbar mb-4 shadow">
      <Navbar.Brand>{title}</Navbar.Brand>
      {/* <li className="nav-item dropdown no-arrow" /> */}
      <Nav className="ml-auto mr-2">
        <Navbar.Text>{username}</Navbar.Text>
        <Nav.Link onClick={logout}>
          <i title="Esci" className="fas fa-sign-out-alt" />
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default TopBar;
