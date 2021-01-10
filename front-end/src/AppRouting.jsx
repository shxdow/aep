import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Account from './scenes/account';
import Home from './scenes/home';
import NotFound from './scenes/NotFound';
import TicketInfo from './scenes/ticket-info';
import TicketList from './scenes/ticket-list';
import TicketNew from './scenes/ticket-new';

const AppRouting = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/account" component={Account} />
    <Route exact path="/tickets" component={TicketList} />
    <Route exact path="/tickets/new" component={TicketNew} />
    <Route exact path="/tickets/:ticketId" component={TicketInfo} />

    <Route path="/" component={NotFound} />
  </Switch>
);

export default AppRouting;
