import React from 'react';

import TicketInfo from './TicketInfo';
import TicketInfoActionsContext from './TicketInfoActionsContext';
import actions from './actions.tickets';

export default () => (
  <TicketInfoActionsContext.Provider value={actions}>
    <TicketInfo />
  </TicketInfoActionsContext.Provider>
);
