import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Account from './scenes/account';
import Home from './scenes/home';
import NotFound from './scenes/NotFound';

const AppRouting = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/account" component={Account} />

    <Route path="/" component={NotFound} />
  </Switch>
);

export default AppRouting;
