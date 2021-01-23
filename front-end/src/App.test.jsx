import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import App from './App';
import AppRouting from './AppRouting';
import withAuth from './withAuth';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });
});

const renderWithRoute = (route) => {
  sessionStorage.setItem('loggedIn', true);
  const history = createMemoryHistory();
  history.push(route);
  return render(
    <Router history={history}>
      <AppRouting withAuth={withAuth} />
    </Router>,
  );
};

describe('Basic environment', () => {
  it('is present and correct', () => {
    require('./secrets.js');
    expect(global.SERVER_ADDRESS).toBeTruthy();
  });
})

describe('Basic authentication', () => {
  it('goes to the home if there is a logged user', () => {
    renderWithRoute('/login');
    expect(screen.queryByText(/inserisci le tue credenziali/i)).toBeNull();
  });

  it('stays home if there is a logged user', () => {
    renderWithRoute('/');
    expect(screen.queryByText(/inserisci le tue credenziali/i)).toBeNull();
  })
});