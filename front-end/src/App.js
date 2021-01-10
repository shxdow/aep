import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import Home from './scenes/home';
import Account from './scenes/account';

const App = () => (
  <HashRouter hashType="hashbang">
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/account" component={Account} />
    </Switch>
  </HashRouter>
);

export default App;
