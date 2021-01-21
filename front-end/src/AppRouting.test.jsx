import React from 'react';
import Cookies from 'js-cookie';
import { render, screen, act } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import AppRouting from './AppRouting';

const waitForPainting = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    wrapper.update();
  });
};

const renderWithRoute = (route) => {
  const history = createMemoryHistory();
  history.push(route);
  const wrapper = render(
    <Router history={history}>
      <AppRouting withAuth={x => x} />
    </Router>,
  );
  waitForPainting(wrapper);
  return wrapper;
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
    expect(screen.getByText(/^nuovo ticket$/i)).toBeInTheDocument();
  });

  it('has a ticket info page', () => {
    renderWithRoute('/tickets/1234');
    expect(screen.queryByText(/404/i)).toBeNull();
  });

  it('has a login page', () => {
    renderWithRoute('/login');
    expect(screen.getByText(/inserisci le tue credenziali/i)).toBeInTheDocument();
  });

  it('has a user signup page', () => {
    renderWithRoute('/signup');
    expect(screen.getByText(/crea account/i)).toBeInTheDocument();
  });
});
