import React from 'react';
import { render, screen } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import '@testing-library/jest-dom/extend-expect';

import Table, { Column } from './index';

const data = [
  { make: "Toyota", model: "Celica" },
  { make: "Ford", model: "Mondeo" },
  { make: "Porsche", model: "Boxter" },
];

const renderTable = (props) => {
  return render(
    <Table data={data} {...props}>
      <Column field="make" />
      <Column field="model" />
    </Table>
  );
};

describe('Table', () => {
  it('renders correctly', () => {
    renderTable();

    data.forEach(({ make, model }) => {
      expect(screen.getByText(make)).toBeInTheDocument();
      expect(screen.getByText(model)).toBeInTheDocument();
    })
  });

  it('shows and hides loading prop', () => {
    renderTable({ loading: true });
    renderTable({ loading: false });

    expect(screen.queryByText(/loading/i)).toBeNull();
  })
});
