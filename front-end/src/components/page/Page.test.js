import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Page from './Page';

const renderPage = (title, content = null) => {
  const history = createMemoryHistory();
  return render(
    <Router history={history}>
      <Page title={title}>{content}</Page>
    </Router>
  );
};

describe('Page', () => {
  it('has always a link to the home', () => {
    renderPage('Test');
    expect(screen.getByText(/ticketing/i).closest('a')).toHaveAttribute('href', '/');
  });

  it('has the correct title', () => {
    renderPage('The quick brown fox');
    expect(screen.getByText('The quick brown fox')).toBeInTheDocument();
  });
});
