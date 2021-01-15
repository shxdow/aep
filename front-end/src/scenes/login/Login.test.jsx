import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Login from './Login';
import validate from './validation.login';

const renderWithHistory = (content) => {
  const history = createMemoryHistory();
  return render(<Router history={history}>{content}</Router>);
};

describe('Login page', () => {
  it('has a username input', () => {
    renderWithHistory(<Login />);
    expect(screen.getByPlaceholderText('Inserisci il nome utente')).toBeInTheDocument();
  });

  it('has a password input', () => {
    renderWithHistory(<Login />);
    expect(screen.getByPlaceholderText('Inserisci la password')).toBeInTheDocument();
  });

  it('correctly accepts inputs', () => {
    renderWithHistory(<Login />);
    fireEvent.change(screen.getByPlaceholderText('Inserisci il nome utente'), { target: { value: 'username' } });
    fireEvent.change(screen.getByPlaceholderText('Inserisci la password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByTestId('login-button'));
  });
});

describe('Login validation', () => {
  it('is correct with both username and password', () => {
    expect(Object.keys(validate({ username: 'a', password: 'a' })).length).toBe(0);
  });

  it('is identifies username and password errors', () => {
    const errors = validate({});
    expect(errors.username).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });
});
