import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import '@testing-library/jest-dom/extend-expect';

import Menu from './Menu';
import MenuSectionHeader from './MenuSectionHeader';
import MenuSectionItem from './MenuSectionItem';

const renderWithRouter = (content) => {
  const history = createMemoryHistory();
  return render(<Router history={history}>{content}</Router>);
};

describe('Menu', () => {
  it('always has a link to home: "AI ticketing"', () => {
    renderWithRouter(<Menu />);
    expect(screen.getByText(/ai ticketing/i).closest('a')).toHaveAttribute('href', '/');
  });

  it('has clickable sections', () => {
    renderWithRouter(<Menu />);
    fireEvent.click(screen.getByText(/^ticket$/i).closest('li'));
  });
});

describe('MenuSectionHeader', () => {
  it('has the correct title', () => {
    renderWithRouter(<MenuSectionHeader title="Hello" />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});

describe('MenuSectionItem', () => {
  it('has the correct text', () => {
    renderWithRouter(<MenuSectionItem text="Hello" to="/" />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });

  it('has the correct link', () => {
    renderWithRouter(<MenuSectionItem text="Hello" to="/" />);
    expect(screen.getByText(/hello/i).closest('a')).toHaveAttribute('href', '/');
  });
});
