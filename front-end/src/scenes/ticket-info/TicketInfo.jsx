import React, { useState, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';

import Card from '../../components/card';
import Page from '../../components/page';

import actions from './actions.tickets';

import TicketGraphics from './TicketInfoGraphics';
import './tickets.css';

const TicketInfo = () => {
  const [ticketInfo, setTicketInfo] = useState(null);
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const submitComment = useCallback((e) => {
    e.preventDefault();

    if (!comment) return;

    setSubmitting(true);
    actions.createComment(ticketId, comment)
      .then(() => {
        setComment('');
        loadTicketInfo();
      })
      .catch((ex) => setCommentError(ex.message))
      .finally(() => setSubmitting(false));
  }, [ticketId, comment, loadTicketInfo]);

  const updateComment = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const updateStatus = useCallback(({ value }) => {
    const previousStatus = ticketInfo?.status;
    setTicketInfo((prev) => ({ ...prev, status: value }));
    actions
      .changeTicketStatus(ticketId, value)
      .catch(() => setTicketInfo((prev) => ({ ...prev, status: previousStatus })));
  }, [ticketId, ticketInfo?.status]);

  useEffect(() => {
    if (!ticketId) return;
    loadTicketInfo();
  }, [ticketId, loadTicketInfo]);

  if (loading) {
    return (
      <Page title={`Informazioni ticket ${ticketId}`}>
        <Card title="Informazioni del ticket" hideSearch>
          <ProgressBar now={100} animated />
        </Card>
      </Page>
    );
  }

  return (
    <TicketGraphics
      ticketInfo={ticketInfo}
      comment={comment}
      onStatusChange={updateStatus}
      onCommentChange={updateComment}
      onCommentSubmit={submitComment}
      error={error}
      commentError={commentError}
      submitting={submitting}
    />
  );
};

export default TicketInfo;
