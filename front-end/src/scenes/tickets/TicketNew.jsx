import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Alert, Button } from 'react-bootstrap';

import Card from '../../components/card';
import Page from '../../components/page';

import actions from './actions.tickets';
import validate from './validation.tickets';

const TicketNew = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [titleError, setTitleError] = useState('');
  const [contentError, setContentError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const createTicket = useCallback(async (e) => {
    e.preventDefault();

    const errors = validate({ title, content });
    if (errors.title || errors.content) {
      setTitleError(errors.title);
      setContentError(errors.content);
      return;
    }

    setLoading(true);
    try {
      await actions.createTicket(title, content);
      history.push('/tickets');
    } catch (ex) {
      setError(ex.message);
      setLoading(false);
    }
  }, [title, content, history]);

  const updateTitle = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  const updateContent = useCallback((e) => {
    setContent(e.target.value);
  }, []);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    const errors = validate({ title, content });
    if (name === 'title') {
      setTitleError(errors.title);
    } else if (name === 'contenuto') {
      setContentError(errors.content);
    }
  }, [title, content]);

  return (
    <Page title="Nuovo ticket">
      <Card title="Inserisci i dati del ticket" hideSearch>
        <Form onSubmit={createTicket}>
          <div className="row">
            <div className="col-12 col-md-6">
              <Form.Group controlId="title">
                <Form.Label>Titolo</Form.Label>
                <Form.Control
                  name="title"
                  value={title}
                  onChange={updateTitle}
                  type="text"
                  isInvalid={titleError}
                  onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{titleError}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Form.Group controlId="contenuto">
                <Form.Label>Contenuto</Form.Label>
                <Form.Control
                  name="contenuto"
                  value={content}
                  onChange={updateContent}
                  type="text"
                  isInvalid={contentError}
                  onBlur={handleBlur}
                />
                <Form.Control.Feedback type="invalid">{contentError}</Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div>
              <Button
                data-testid="create-button"
                block
                type="submit"
                variant="primary"
                size="lg"
                className="text-uppercase"
                onClick={createTicket}
                disabled={loading}
              >
                {loading ? '...' : 'Crea ticket'}
              </Button>
            </div>
          </div>
        </Form>
      </Card>
    </Page>
  );
};

export default TicketNew;
