import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import App from './App';

test('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

test('has a home route', () => {
  const history = createMemoryHistory();
  history.push('/');
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  expect(screen.getByText(/home/i)).toBeInTheDocument();
});

test('has an account route', () => {
  const history = createMemoryHistory();
  history.push('/account');
  render(
    <Router history={history}>
      <App />
    </Router>
  );

  screen.getAllByText(/account/i).forEach((x) => expect(x).toBeInTheDocument());
});
