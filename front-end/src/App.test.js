import React from 'react';
import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('has loaded the .env environment file', () => {
    expect(process.env.SERVER_ADDRESS).not.toBeFalsy();
  });
});
