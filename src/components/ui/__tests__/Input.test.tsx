import React from 'react';
import { render, screen } from '@testing-library/react';
import { Input } from '../Input';

describe('Input component', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder="email" />);
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
  });
});
