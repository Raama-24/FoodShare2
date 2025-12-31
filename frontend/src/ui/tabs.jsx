import React, { useState, createContext, useContext } from "react";
import { cn } from "../lib/utils";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, className }) {
  const [active, setActive] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className }) {
  return <div className={cn("flex border-b", className)}>{children}</div>;
}

export function TabsTrigger({ value, children, className, onClick }) {
  const { active, setActive } = useContext(TabsContext);

  return (
    <button
      onClick={() => {
        setActive(value);
        onClick?.();
      }}
      className={cn(
        "px-4 py-2 text-sm font-medium border-b-2 transition-all",
        active === value ? "border-black" : "border-transparent opacity-60",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const { active } = useContext(TabsContext);
  if (active !== value) return null;

  return <div className={cn("py-4", className)}>{children}</div>;
}