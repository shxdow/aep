import React from 'react';
import { HashRouter } from 'react-router-dom';

import './index.css';
import './theme/sb-admin-2.min.css';
import './theme/fontawesome-free/css/all.min.css';

import AppRouting from './AppRouting';
import withAuth from './withAuth';

const App = () => (
  <HashRouter hashType="hashbang">
    <AppRouting withAuth={withAuth} />
  </HashRouter>
);

export default App;
