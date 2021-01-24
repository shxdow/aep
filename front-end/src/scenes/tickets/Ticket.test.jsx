import React from 'react';
import { render, screen, act, wait, fireEvent, queryAllByAttribute } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router, Route } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import {
  TicketList,
  TicketNew,
} from './index';

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

describe('Ticket list', () => {
  it('renders correctly', () => {
    renderWithRouter(<TicketList />);
  });

  it('filters data', () => {
    renderWithRouter(<TicketList />);
    fireEvent.change(
      screen.getByPlaceholderText('Filtra...'),
      { target: { value: 'Titolo' } }
    );
  });

  it('correctly formats the status of a ticket', () => {
    expect(Status.format({ value: Status.Open })).toBe('Aperto');
    expect(Status.format({ value: Status.Closed })).toBe('Chiuso');
    expect(Status.format({ value: Status.Progress })).toBe('In corso');
    expect(Status.format({ value: Status.Triaged })).toBe('Assegnato');
  });

  it('goes to the ticket creation page', () => {
    const { history: h } = renderWithRouter(<TicketList />);
    fireEvent.click(screen.getByTestId('create-button'));
    expect(h.location.pathname).toBe('/tickets/new');
  });
});

describe('Ticket creation page', () => {
  it('renders correctly', () => {
    renderWithRouter(<TicketNew />);
  });

  it('has a title input', () => {
    renderWithRouter(<TicketNew />);
    expect(screen.getByLabelText(/titolo/i)).toBeInTheDocument();
  });

  it('has a content input', () => {
    renderWithRouter(<TicketNew />);
    expect(screen.getByLabelText(/contenuto/i)).toBeInTheDocument();
  });

  it('handles wrong input', () => {
    renderWithRouter(<TicketNew />);

    fireEvent.click(screen.getByText(/crea ticket/i));

    fireEvent.blur(screen.getByLabelText(/titolo/i));
    fireEvent.blur(screen.getByLabelText(/contenuto/i));
  });

  it('handles correct inputs', () => {
    renderWithRouter(<TicketNew />);
    const title = screen.getByLabelText(/titolo/i).closest('input');
    const content = screen.getByLabelText(/contenuto/i).closest('input');

    fireEvent.change(title, { target: { value: 'titolo' } });
    fireEvent.blur(title, { name: 'title' });
    fireEvent.change(content, { target: { value: 'Contenuto' } });
    fireEvent.blur(content, { name: 'contenuto' });
    fireEvent.click(screen.getByText(/crea ticket/i), { preventDefault: () => { } });
  });
});
