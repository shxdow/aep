import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Signup from './Signup';
import validate from './validation.signup';

const renderWithHistory = (content) => {
  const history = createMemoryHistory();
  return render(<Router history={history}>{content}</Router>);
};

describe('Signup page', () => {
  it('has a username input', () => {
    renderWithHistory(<Signup />);
    expect(screen.getByLabelText(/nome utente/i)).toBeInTheDocument();
  });

  it('has a password input', () => {
    renderWithHistory(<Signup />);
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
  });

  it('has a confirm password input', () => {
    renderWithHistory(<Signup />);
    expect(screen.getByLabelText(/conferma password/i)).toBeInTheDocument();
  });

  it('correctly accepts inputs', () => {
    renderWithHistory(<Signup />);
    const username = screen.getByLabelText(/nome utente/i);
    const password = screen.getByLabelText(/^password$/i);
    const confermaPassword = screen.getByLabelText(/conferma password/i);

    fireEvent.change(username, { target: { value: 'username' } });
    fireEvent.blur(username);
    fireEvent.change(password, { target: { value: 'Password123' } });
    fireEvent.blur(password);
    fireEvent.change(confermaPassword, { target: { value: 'Password123' } });
    fireEvent.blur(confermaPassword);
    fireEvent.click(screen.getByTestId('signup-button'));
  });
});

describe('Signup validation', () => {
  it('is correct with both username and password', () => {
    expect(Object.keys(validate({
      username: 'a',
      password: 'Test123,',
      confermaPassword: 'Test123,',
    })).length).toBe(0);
  });

  it('is identifies username errors', () => {
    const errors = validate({});
    expect(errors.username).toBeTruthy();
  });

  it('is identifies password errors', () => {
    let errors = validate({ password: 'a' });
    expect(errors.password).toBeTruthy();
    errors = validate({ password: '123' });
    expect(errors.password).toBeTruthy();
    errors = validate({ password: 'Aa23' });
    expect(errors.password).toBeTruthy();
  });
});
