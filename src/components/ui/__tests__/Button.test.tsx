import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Button component', () => {
  it('renders with provided text', () => {
    render(<Button>click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('click me');
  });
});
