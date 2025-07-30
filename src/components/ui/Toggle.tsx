import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, ...props }, ref) => (
    <button
      ref={ref}
      data-pressed={pressed}
      aria-pressed={pressed}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium transition-colors data-[pressed=true]:bg-blue-600 data-[pressed=true]:text-white',
        className
      )}
      {...props}
    />
  )
);
Toggle.displayName = 'Toggle';
