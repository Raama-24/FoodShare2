// src/ui/dropdown-menu.jsx
import {
  Menu,
  MenuItem,
  MenuButton,
  MenuList,
  MenuDivider,
} from "@reach/menu-button";
import "@reach/menu-button/styles.css";

export const DropdownMenu = ({ children }) => <Menu>{children}</Menu>;
export const DropdownMenuTrigger = ({ children, asChild }) => (
  <MenuButton as={asChild}>{children}</MenuButton>
);
export const DropdownMenuContent = ({ children, className }) => (
  <MenuList className={className}>{children}</MenuList>
);
export const DropdownMenuLabel = ({ children }) => (
  <div className="px-3 py-1 text-sm font-medium text-muted-foreground">{children}</div>
);
export const DropdownMenuSeparator = () => <MenuDivider />;
export const DropdownMenuRadioGroup = ({ children, value, onValueChange }) => (
  <div role="radiogroup" value={value} onChange={(e) => onValueChange(e.target.value)}>
    {children}
  </div>
);
export const DropdownMenuRadioItem = ({ value, children }) => (
  <div role="radio" value={value} className="px-3 py-1 hover:bg-muted cursor-pointer">
    {children}
  </div>
);
