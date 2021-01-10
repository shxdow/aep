import React from 'react';
import { useParams } from 'react-router-dom';

import Page from '../../components/page';

const TicketInfo = () => {
  const { ticketId } = useParams();
  return (
    <Page title={`Informazioni ticket ${ticketId || ''}`}>
      <h1 className="h3 mb-4 text-gray-800">Ticket</h1>
    </Page>
  );
};

export default TicketInfo;
