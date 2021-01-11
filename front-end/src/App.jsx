import React from 'react';
import { HashRouter } from 'react-router-dom';

import './index.css';
import './theme/sb-admin-2.min.css';
import './theme/fontawesome-free/css/all.min.css';

import AppRouting from './AppRouting';

const App = () => (
  <HashRouter hashType="hashbang">
    <AppRouting />
  </HashRouter>
);

export default App;
