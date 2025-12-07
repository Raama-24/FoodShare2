import React, { useState } from 'react';
import { cn } from '../lib/utils';

export function Dialog({ open, onClose, children, className }) {
  if (!open) return null;

  return (
    <div className={cn('fixed inset-0 z-50 flex items-center justify-center bg-black/50', className)}>
      <div className='bg-white rounded-lg shadow-lg p-6 relative'>
        {children}
        <button
          onClick={onClose}
          className='absolute top-2 right-2 text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export function DialogHeader({ children, className }) {
  return <div className={cn('mb-4 text-lg font-semibold', className)}>{children}</div>;
}



export function DialogTitle({ children, className }) {
return <h2 className={cn('text-xl font-bold mb-4', className)}>{children}</h2>;
}

export function DialogContent({ children, className }) {
  return <div className={cn('mb-4', className)}>{children}</div>;
}

export function DialogFooter({ children, className }) {
  return <div className={cn('flex justify-end gap-2', className)}>{children}</div>;
}