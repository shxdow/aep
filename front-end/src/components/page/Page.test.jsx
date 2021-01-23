import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
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
    sessionStorage.setItem('username', 'Quick brown fox');
    renderWithRouter(<TopBar title="Test" />);
    expect(screen.getByText(/quick brown fox/i)).toBeInTheDocument();
  });

  it('has a logout button', () => {
    renderWithRouter(<TopBar title="Test" />);
    act(() => {
      fireEvent.click(screen.getByTitle(/logout/i));
    });
  });
});
