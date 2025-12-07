import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Heart, Users, ClipboardList } from "lucide-react";
import { Leaf } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const menuItems = [
    { path: "/dashboard/ngo", label: "Dashboard", icon: LayoutDashboard },
    { path: "/dashboard/ngo/donation-drive", label: "Donation Drive", icon: Heart },
    { path: "/dashboard/ngo/members", label: "Members", icon: Users },
    { path: "/dashboard/ngo/requests", label: "Requests", icon: ClipboardList },
  ];

    const isActive = (path) => {
    return location.pathname === path ;
  };

  return (
    <div className="min-h-screen bg-[#F1F8E9]">
      <header className="bg-white border-b border-[rgba(121,85,72,0.15)] sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center">
    <Leaf className="w-5 h-5 text-white" />
  </div>
          <div>
            <h1 className="text-[#263238]">FoodShare</h1>
           
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-[rgba(121,85,72,0.15)] min-h-[calc(100vh-73px)] sticky top-[73px]">
          <nav className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        active
                          ? "bg-[#F1F8E9] text-[#689F38]"
                          : "text-[#795548] hover:bg-[#F1F8E9]/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}