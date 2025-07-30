import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { useToggle } from '../useToggle';

function ToggleComponent() {
  const { value, toggle } = useToggle();
  return (
    <div>
      <span data-testid="value">{value ? 'true' : 'false'}</span>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

describe('useToggle hook', () => {
  test('toggles value when button clicked', () => {
    render(<ToggleComponent />);
    const value = screen.getByTestId('value');
    expect(value.textContent).toBe('false');
    fireEvent.click(screen.getByText('toggle'));
    expect(value.textContent).toBe('true');
  });
});
