import React from 'react';
import Cookies from 'js-cookie';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Page from './Page';
import TopBar from './TopBar';

const renderWithRouter = (content) => {
  const history = createMemoryHistory();
  return render(<Router history={history}>{content}</Router>);
};

describe('Page', () => {
  it('has the correct title', () => {
    renderWithRouter(<Page title="The quick brown fox" />);
    expect(screen.getByText('The quick brown fox')).toBeInTheDocument();
  });
});

describe('TopBar', () => {
  it('has the correct title', () => {
    renderWithRouter(<TopBar title="Test" />);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it('has the correct username', () => {
    Cookies.set('username', 'Quick brown fox');
    renderWithRouter(<TopBar title="Test" />);
    expect(screen.getByText(/quick brown fox/i)).toBeInTheDocument();
  });
});
