// src/ui/separator.jsx
export function Separator({ className = "" }) {
  return (
    <hr
      className={`border-t border-[rgba(121,85,72,0.15)] my-4 ${className}`}
    />
  );
}
