import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import App from './App';
import AppRouting from './AppRouting';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('has a home route', () => {
  const history = createMemoryHistory();
  history.push('/');
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );

  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('has an account route', () => {
  const history = createMemoryHistory();
  history.push('/account');
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );

  screen.getAllByText(/account/i).forEach((x) => expect(x).toBeInTheDocument());
});

test('has a 404 page', () => {
  const history = createMemoryHistory();
  history.push('/some/random/page');
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );

  expect(screen.getByText(/404/i)).toBeInTheDocument();
});

test('has a ticket list page', () => {
  const history = createMemoryHistory();
  history.push('/tickets');
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );

  expect(screen.getByText(/elenco ticket/i)).toBeInTheDocument();
});

test('has a ticket creation page', () => {
  const history = createMemoryHistory();
  history.push('/tickets/new');
  render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );

  expect(screen.getByText(/creazione nuovo ticket/i)).toBeInTheDocument();
});
