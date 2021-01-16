import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import Card from './Card';

const renderCard = (props) => {
  return render(<Card {...props} />);
};

describe('Card', () => {
  it('renders correctly', () => {
    renderCard();
    renderCard({
      onCreate: () => { },
      onDelete: () => { },
      onEdit: () => { },
      buttonsEnabled: false,
    });
  });

  it('handles search input', () => {
    let search = '';
    renderCard({
      search,
      onSearchChange: (val) => { search = val; },
    });

    fireEvent.change(
      screen.getByPlaceholderText(/filtra\.\.\./i),
      { target: { value: 'hello' } },
    );
    expect(search).toEqual('hello');
  })
});
