import React from 'react';
import { render, screen, act, wait, fireEvent, queryAllByAttribute } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import TicketInfo from './index';
import TicketInfoGraphics from './TicketInfoGraphics';
import TicketComment from './TicketInfoComment';

import { Status } from './constants.tickets';

const waitForPainting = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
};

const renderWithRouter = (content, route = null) => {
  const history = createMemoryHistory();
  if (route) history.push(route)
  const wrapper = render(<Router history={history}>{content}</Router>);
  waitForPainting(wrapper);
  return { wrapper, history };
};

const renderTicketInfoPage = (id, component) => {
  const history = createMemoryHistory();
  history.push(`/tickets/${id}`);
  const wrapper = render(
    <Router history={history}>
      <Route exact path="/tickets/:ticketId" component={component} />
    </Router>
  );
  waitForPainting(wrapper);
  return { wrapper, history };
}

describe('Ticket info page', () => {
  it('renders correctly', () => {
    renderTicketInfoPage(1234, TicketInfo);
    expect(screen.getByText(/informazioni ticket 1234/i)).toBeInTheDocument();
  });

  it('can submit comments', () => {
    renderTicketInfoPage(1234, () => <TicketInfoGraphics ticketInfo={{ comments: [] }} />);
    const comment = screen.getByPlaceholderText(/commenta qualcosa/i).closest('input');
    fireEvent.change(comment, { target: { value: 'Commento' } });
    fireEvent.click(screen.getByText(/^commenta$/i));
  });
});

describe('Ticket comment', () => {
  it('renders correctly', () => {
    render(<TicketComment from="A" content="B" />);
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });
});
