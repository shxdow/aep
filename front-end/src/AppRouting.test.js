import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import AppRouting from './AppRouting';

const renderWithRoute = (route) => {
  const history = createMemoryHistory();
  history.push(route);
  return render(
    <Router history={history}>
      <AppRouting />
    </Router>
  );
};

describe('App routing', () => {
  it('has a home page', () => {
    renderWithRoute('/');
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  it('has an account page', () => {
    renderWithRoute('/account');
    screen.getAllByText(/account/i).forEach((x) => expect(x).toBeInTheDocument());
  });

  it('has a registration page', () => {
    renderWithRoute('/account/new');
    expect(screen.getByText(/nuovo account/i)).toBeInTheDocument();
  });

  it('has a 404 page', () => {
    renderWithRoute('/some/random/route');
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('has a ticket list page', () => {
    renderWithRoute('/tickets');
    expect(screen.getByText(/elenco ticket/i)).toBeInTheDocument();
  });

  it('has a ticket creation page', () => {
    renderWithRoute('/tickets/new');
    expect(screen.getByText(/creazione nuovo ticket/i)).toBeInTheDocument();
  });

  it('has a ticket info page', () => {
    renderWithRoute('/tickets/1234');
    expect(screen.getByText(/informazioni ticket 1234/i)).toBeInTheDocument();
  });

  it('has a login page', () => {
    renderWithRoute('/login');
    expect(screen.getByText(/inserisci le tue credenziali/i)).toBeInTheDocument();
  });
});
