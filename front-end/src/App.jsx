import React from 'react';
import { HashRouter } from 'react-router-dom';

import AppRouting from './AppRouting';

const App = () => (
  <HashRouter hashType="hashbang">
    <AppRouting />
  </HashRouter>
);

export default App;
