import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Account from './scenes/account';
import Home from './scenes/home';
import Login from './scenes/login';
import NotFound from './scenes/NotFound';
import Signup from './scenes/signup';
import { TicketInfo, TicketList, TicketNew } from './scenes/tickets';

import withAuth from './withAuth';

const AppRouting = () => (
  <Switch>
    <Route exact path="/" component={withAuth(Home)} />
    <Route exact path="/account" component={withAuth(Account)} />
    <Route exact path="/tickets" component={withAuth(TicketList)} />
    <Route exact path="/tickets/new" component={withAuth(TicketNew)} />
    <Route exact path="/tickets/:ticketId" component={withAuth(TicketInfo)} />

    <Route exact path="/login" component={Login} />
    <Route exact path="/signup" component={Signup} />

    <Route path="/" component={NotFound} />
  </Switch>
);

export default AppRouting;
