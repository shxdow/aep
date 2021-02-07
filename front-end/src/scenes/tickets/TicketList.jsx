import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import Card from '@components/card';
import Page from '@components/page';
import Table, { Column } from '@components/table';

import actions from './actions.tickets';
import { Status } from './constants.tickets';

const formatNumber = ({ value }) => `Numero ${value}`;

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [canCreate, setCanCreate] = useState(true);
  const history = useHistory();

  useEffect(() => {
    actions.getTickets()
      .then(setTickets)
      .catch(() => { })
      .finally(() => setLoading(false));

    if (!sessionStorage.getItem('client')) {
      setCanCreate(false);
    }
  }, []);

  const createTicket = useCallback(() => {
    history.push('/tickets/new');
  }, [history]);

  const viewTicket = useCallback(() => {
    if (selected) {
      history.push(`/tickets/${selected.id}`);
    }
  }, [selected, history]);

  const handleSelection = useCallback((rows) => {
    setSelected(rows[0]);
  }, []);

  return (
    <Page title="Elenco ticket">
      <Card
        title="Qui puoi vedere i tuoi ticket"
        search={search}
        onSearchChange={setSearch}
        onCreate={canCreate ? createTicket : null}
        onEdit={viewTicket}
        buttonsEnabled={!!selected}
      >
        <Table
          data={tickets}
          loading={loading}
          quickFilter={search}
          onRowSelected={handleSelection}
        >
          <Column
            field="id"
            headerName="Numero"
            checkboxSelection
            valueFormatter={formatNumber}
          />
          <Column field="title" headerName="Titolo" />
          <Column
            field="status"
            headerName="Stato"
            valueFormatter={Status.format}
          />
        </Table>
      </Card>
    </Page>
  );
};

export default TicketList;
