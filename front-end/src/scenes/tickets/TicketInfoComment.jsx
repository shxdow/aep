import React from 'react';

const TicketInfoComment = ({ from, content }) => {
  return (
    <div className="ticket-comment">
      <div className="ticket-comment-from">{from}</div>
      <div className="ticket-comment-content">{content}</div>
    </div>
  );
};

export default TicketInfoComment;
