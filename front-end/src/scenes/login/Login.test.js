import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Login from './Login';

const renderWithHistory = (content) => {
  const history = createMemoryHistory();
  return render(<Router history={history}>{content}</Router>);
};

describe('Login page', () => {
  it('has a link to the registration page', () => {
    renderWithHistory(<Login />);
    expect(screen.getByText(/nuovo account/i).closest('a')).toHaveAttribute('href', '/account/new');
  });
});
