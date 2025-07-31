import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

test('renders button text', () => {
  render(<Button>hello world</Button>);
  expect(screen.getByRole('button')).toHaveTextContent('hello world');
});
