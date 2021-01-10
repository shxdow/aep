import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './scenes/home';

const App = () => (
  <HashRouter hashType="hashbang">
    <Switch>
      <Route exact path="/" component={Home} />
    </Switch>
  </HashRouter>
);

export default App;
