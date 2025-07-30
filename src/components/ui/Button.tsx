import * as React from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'default' | 'ghost' | 'outline';
export type ButtonSize = 'default' | 'icon';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none';
    const variants: Record<ButtonVariant, string> = {
      default: 'bg-blue-600 text-white hover:bg-blue-700',
      ghost: 'bg-transparent hover:bg-slate-100',
      outline: 'border border-slate-300 bg-white hover:bg-slate-100',
    };
    const sizes: Record<ButtonSize, string> = {
      default: 'h-10 px-4',
      icon: 'h-10 w-10',
    };
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
