import React, { useState, useCallback, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';

import Card from '../../components/card';
import Page from '../../components/page';

import TicketInfoActionsContext from './TicketInfoActionsContext';

import TicketGraphics from './TicketInfoGraphics';
import './tickets.css';

const TicketInfo = () => {
  const actions = useContext(TicketInfoActionsContext);
  const [ticketInfo, setTicketInfo] = useState(null);
  const [comment, setComment] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [commentError, setCommentError] = useState('');

  const { ticketId } = useParams();

  const loadTicketInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await actions.getTicketInfo(ticketId);
      setTicketInfo(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId, actions]);

  const submitComment = useCallback(async (e) => {
    e.preventDefault();

    if (!comment) return;

    setSubmitting(true);
    try {
      await actions.createComment(ticketId, comment);
      setComment('');
      loadTicketInfo();
    } catch (ex) {
      setCommentError(ex.message);
    } finally {
      setSubmitting(false);
    }
  }, [ticketId, comment, loadTicketInfo, actions]);

  const updateComment = useCallback((e) => {
    setComment(e.target.value);
  }, []);

  const updateStatus = useCallback(async ({ value }) => {
    const previousStatus = ticketInfo?.status;
    setTicketInfo((prev) => ({ ...prev, status: value }));
    try {
      await actions.changeTicketStatus(ticketId, value);
    } catch (e) {
      setTicketInfo((prev) => ({ ...prev, status: previousStatus }));
    }
  }, [ticketId, ticketInfo?.status, actions]);

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
