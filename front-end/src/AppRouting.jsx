import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Account from './scenes/account';
import Home from './scenes/home';
import Login from './scenes/login';
import NotFound from './scenes/NotFound';
import TicketInfo from './scenes/ticket-info';
import TicketList from './scenes/ticket-list';
import TicketNew from './scenes/ticket-new';
import Registration from './scenes/registration';

import withAuth from './withAuth';

const AuthRoute = ({ component, ...props }) => <Route {...props} component={withAuth(component)} />;

const AppRouting = () => (
  <Switch>
    <AuthRoute exact path="/" component={Home} />
    <AuthRoute exact path="/account" component={Account} />
    <AuthRoute exact path="/tickets" component={TicketList} />
    <AuthRoute exact path="/tickets/new" component={TicketNew} />
    <AuthRoute exact path="/tickets/:ticketId" component={TicketInfo} />

    <Route exact path="/account/new" component={Registration} />
    <Route exact path="/login" component={Login} />

    <Route path="/" component={NotFound} />
  </Switch>
);

export default AppRouting;
