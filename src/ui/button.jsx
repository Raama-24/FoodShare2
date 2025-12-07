// src/ui/button.jsx
import { cn } from "../lib/utils";

export function Button({ children, className = "", variant = "default", size = "md", ...props }) {
  const base = "rounded-md font-medium transition-colors focus:outline-none";
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };
  const variants = {
    default: "bg-primary text-white hover:bg-primary-dark",
    outline: "border border-primary text-primary hover:bg-primary-light",
  };

  return (
    <button
      className={cn(base, sizes[size], variants[variant] || "", className)}
      {...props}
    >
      {children}
    </button>
  );
}
