import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import Page from '../components/page';

const NotFound = () => {
  const history = useHistory();

  return (
    <Page title="Pagina non trovata">
      <div className="text-center">
        <div className="error mx-auto">404</div>
        <p className="lead text-gray-800 mb-5">Pagina Non Trovata</p>
        <p className="text-gray-500 mb-0">Sembra che questa pagina non esista...</p>
        <p className="mb-0">
          <Link to="/">
            <i className="fa fa-home mr-2" />
            Torna alla Home
          </Link>
        </p>
        <p>
          <Button variant="link" onClick={history.goBack}>
            <i className="fa fa-arrow-left mr-2" /> Torna indietro
          </Button>
        </p>
      </div>
    </Page>
  );
};

export default NotFound;
