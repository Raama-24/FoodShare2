import React from 'react';
import { cn } from '../lib/utils';

export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';