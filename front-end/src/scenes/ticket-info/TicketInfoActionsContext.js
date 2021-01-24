import React from 'react';

import actions from './actions.tickets';

export default React.createContext({
  getTicketInfo: actions.getTicketInfo,
  changeTicketStatus: actions.changeTicketStatus,
  createComment: actions.createComment,
});
