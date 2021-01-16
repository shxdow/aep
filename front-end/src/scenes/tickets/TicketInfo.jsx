import React, { useState, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import { ProgressBar, Form, Button, Alert } from 'react-bootstrap';

import Card from '../../components/card';
import Page from '../../components/page';

import Comment from './TicketInfoComment';
import actions from './actions.tickets';
import { Status } from './constants.tickets';

import './tickets.css';

const TicketInfo = () => {
  const [ticketInfo, setTicketInfo] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');
  const { ticketId } = useParams();

  const loadTicketInfo = useCallback(() => {
    setLoading(true);
    actions.getTicketInfo(ticketId)
      .then(setTicketInfo)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ticketId]);

  const submitComment = useCallback(async (e) => {
    e.preventDefault();

    if (!comment) return;

    setCommentLoading(true);
    try {
      await actions.createComment(
        Cookies.get('username'),
        ticketId,
        comment,
      );
      loadTicketInfo();
    } catch (ex) {
      setCommentError(ex.message);
    } finally {
      setCommentLoading(false);
    }
  }, [ticketId, comment, loadTicketInfo]);

  const updateComment = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  useEffect(() => {
    if (!ticketId) return;
    loadTicketInfo();
  }, [ticketId, loadTicketInfo]);

  return (
    <Page title={`Informazioni ticket ${ticketId}`}>
      <Card title="Informazioni del ticket" hideSearch>
        {loading
          ? (
            <ProgressBar now={100} animated />
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="ticket-info">
                <div className="ticket-info-label">Numero</div>
                <div className="ticket-info-content">{ticketId}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Titolo</div>
                <div className="ticket-info-content">{ticketInfo.title}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Contenuto</div>
                <div className="ticket-info-content">{ticketInfo.content}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Stato</div>
                <div className="ticket-info-content">{Status.format({ value: ticketInfo.status })}</div>
              </div>
            </>
          )}
      </Card>

      <div className="separator" />

      <Card title="Commenti" hideSearch>
        {loading
          ? (
            <ProgressBar now={100} animated />
          ) : (
            ticketInfo.comments.map((c) => (
              <Comment key={c.id} from={c.user} content={c.content} />
            ))
          )}
      </Card>

      <div className="separator" />

      <Card title="Inserisci un nuovo commento" hideSearch>
        <Form onSubmit={submitComment}>
          <div className="row">
            <div className="col-12 col-md-8">
              <Form.Group controlId="comment">
                <Form.Control
                  type="input"
                  name="comment"
                  value={comment}
                  onChange={updateComment}
                  placeholder="Commenta qualcosa..."
                />
              </Form.Group>
            </div>
            <div className="col-12 col-md-4">
              <Button
                data-testid="comment-button"
                block
                type="submit"
                variant="primary"
                size="lg"
                className="text-uppercase slim-button"
                onClick={submitComment}
                disabled={commentLoading || !comment}
              >
                {commentLoading ? '...' : 'Commenta'}
              </Button>
            </div>
            <div className="col-12">
              {commentError && <Alert variant="danger">{commentError}</Alert>}
            </div>
          </div>
        </Form>
      </Card>
    </Page>
  );
};

export default TicketInfo;
