// src/ui/badge.jsx
export function Badge({ children, className = "", variant = "default", ...props }) {
  return (
    <span
      className={`px-2 py-1 rounded-md text-sm font-medium ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
