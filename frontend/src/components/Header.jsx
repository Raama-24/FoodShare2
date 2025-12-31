import { Link } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
       <Link to="/" className="flex items-center gap-2">
  <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
    <Leaf className="w-5 h-5 text-white" />
  </div>
  <span className="font-bold text-lg text-[#263238]">FoodShare</span>
</Link>


        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground">How It Works</a>
          <a href="#modules" className="text-sm text-muted-foreground hover:text-foreground">Modules</a>
        </nav>

      <div className="flex items-center gap-3">
  <Link
    to="/admin/login"
    className="px-4 py-2 text-sm font-medium text-[#263238] hover:text-[#8BC34A] transition"
  >
    Admin Login
  </Link>
  <Link
    to="/admin/signup"
    className="px-4 py-2 text-sm font-medium text-white bg-[#8BC34A] rounded-lg hover:bg-[#689F38] transition"
  >
   Admin Sign Up
  </Link>
</div>


        {/* Mobile Menu Toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
          <Link to="/" className="block text-sm text-foreground">Home</Link>
          <a href="#how-it-works" className="block text-sm text-foreground">How It Works</a>
          <a href="#modules" className="block text-sm text-foreground">Modules</a>

          <hr className="border-gray-200" />

          <Link to="/login" className="block text-sm">Login</Link>
          <Link to="/signup" className="block text-sm text-primary font-semibold">Sign Up</Link>
        </div>
      )}
    </header>
  );
}
