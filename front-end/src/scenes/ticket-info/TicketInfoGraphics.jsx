import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import { useParams } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';

import Card from '../../components/card';
import Page from '../../components/page';

import Comment from './TicketInfoComment';
import { Status } from './constants.tickets';

const statusOptions = [
  Status.Open,
  Status.Triaged,
  Status.Progress,
  Status.Closed,
].map((value) => ({
  label: Status.format({ value }), value,
}));

const TicketInfoGraphics = ({
  ticketInfo,
  comment,
  onStatusChange,
  onCommentChange,
  onCommentSubmit,
  error,
  commentError,
  submitting,
}) => {
  const [isClient, setIsClient] = useState(false);
  const { ticketId } = useParams();

  const selectedStatus = useMemo(
    () => statusOptions.filter((x) => x.value === ticketInfo?.status),
    [ticketInfo?.status],
  );

  useEffect(() => {
    setIsClient(!!sessionStorage.getItem('client'));
  }, []);

  return (
    <Page title={`Informazioni ticket ${ticketId}`}>
      <Card title="Informazioni del ticket" hideSearch>
        {!ticketInfo
          ? (
            'Sembra non esserci nessun ticket...'
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}
              <div className="ticket-info">
                <div className="ticket-info-label">Numero</div>
                <div className="ticket-info-content">{ticketId}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Titolo</div>
                <div className="ticket-info-content">{ticketInfo?.title}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Contenuto</div>
                <div className="ticket-info-content">{ticketInfo?.description}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Gruppo</div>
                <div className="ticket-info-content">{ticketInfo?.group || 'Nessuno'}</div>
              </div>
              <div className="ticket-info">
                <div className="ticket-info-label">Stato</div>
                {isClient
                  ? (
                    <div className="ticket-info-content">
                      {Status.format({ value: ticketInfo?.status }) || 'Nessuno'}
                    </div>
                  ) : (
                    <div className="ticket-info-control">
                      <Select
                        options={statusOptions}
                        onChange={onStatusChange}
                        value={selectedStatus}
                      />
                    </div>
                  )}
              </div>
            </>
          )}
      </Card>

      <div className="separator" />

      <Card title="Commenti" hideSearch>
        {ticketInfo && (
          ticketInfo.comments.map((c) => (
            <Comment key={c.id} from={c.account} content={c.content} />
          ))
        )}
      </Card>

      <div className="separator" />

      {ticketInfo && (
        <Card title="Inserisci un nuovo commento" hideSearch>
          <Form onSubmit={onCommentSubmit}>
            <div className="row">
              <div className="col-12 col-md-8">
                <Form.Group controlId="comment">
                  <Form.Control
                    type="input"
                    name="comment"
                    value={comment}
                    onChange={onCommentChange}
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
                  onClick={onCommentSubmit}
                  disabled={submitting || !comment}
                >
                  {submitting ? '...' : 'Commenta'}
                </Button>
              </div>
              <div className="col-12">
                {commentError && <Alert variant="danger">{commentError}</Alert>}
              </div>
            </div>
          </Form>
        </Card>
      )}
    </Page>
  );
};

export default TicketInfoGraphics;
