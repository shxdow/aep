import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import AppRouting from './AppRouting';

const renderWithRoute = (route) => {
  const history = createMemoryHistory();
  history.push(route);
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );
};

test('has a home route', () => {
  renderWithRoute('/');
  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('has an account route', () => {
  renderWithRoute('/account');
  screen.getAllByText(/account/i).forEach((x) => expect(x).toBeInTheDocument());
});

test('has a 404 page', () => {
  renderWithRoute('/some/random/route');
  expect(screen.getByText(/404/i)).toBeInTheDocument();
});

test('has a ticket list page', () => {
  renderWithRoute('/tickets');
  expect(screen.getByText(/elenco ticket/i)).toBeInTheDocument();
});

test('has a ticket creation page', () => {
  renderWithRoute('/tickets/new');
  expect(screen.getByText(/creazione nuovo ticket/i)).toBeInTheDocument();
});

test('has a ticket info page', () => {
  renderWithRoute('/tickets/1234');
  expect(screen.getByText(/informazioni ticket 1234/i)).toBeInTheDocument();
});
