import React from 'react';
import { Navbar, ProgressBar } from 'react-bootstrap';

import Menu from './menu';

const FakeLoadingPage = () => (
  <div id="wrapper">
    <Menu />
    <div id="content-wrapper" className="d-flex flex-column">
      <div id="content" style={{ height: '100vh', overflowY: 'scroll' }}>
        <Navbar sticky="top" className="bg-white topbar mb-4 shadow">
          <Navbar.Brand>Stiamo caricando la tua pagina...</Navbar.Brand>
        </Navbar>
        <div className="container-fluid">
          <ProgressBar now={100} animated />
        </div>
      </div>
    </div>
  </div>
);

FakeLoadingPage.propTypes = {};

export default FakeLoadingPage;
