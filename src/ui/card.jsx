// src/ui/card.jsx
import React from "react";
import { cn } from "../lib/utils";
export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white border border-[rgba(121,85,72,0.15)] rounded-lg shadow-sm p-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}


export function CardHeader({ children, className }) {
return <div className={cn('mb-2', className)}>{children}</div>;
}


export function CardTitle({ children, className }) {
return <h3 className={cn('text-lg font-semibold', className)}>{children}</h3>;
}


export function CardContent({ children, className }) {
return <div className={cn('text-sm text-gray-700', className)}>{children}</div>;
}


export function CardFooter({ children, className }) {
return <div className={cn('mt-4', className)}>{children}</div>;
}