import { Outlet, NavLink } from "react-router";
import { LayoutDashboard, Package, ClipboardList, Boxes } from "lucide-react";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", Icon: ClipboardList, end: false },
  { to: "/admin/products", label: "Products", Icon: Package, end: false },
  { to: "/admin/inventory", label: "Inventory", Icon: Boxes, end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex">
      <aside className="w-16 md:w-60 bg-neutral-900 text-white flex flex-col shrink-0 transition-all">
        <div className="h-16 flex items-center justify-center md:justify-start px-3 md:px-5 font-semibold text-base md:text-lg border-b border-white/10">
          <span className="hidden md:inline">PawMandu Admin</span>
          <span className="md:hidden font-bold text-xs">PM</span>
        </div>
        <nav className="flex-1 py-4 px-2 md:px-3 space-y-1">
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={label}
              className={({ isActive }) =>
                `flex items-center justify-center md:justify-start gap-2.5 px-2.5 md:px-3 py-2 rounded-[var(--radius-sm)] text-sm transition-colors ${
                  isActive
                    ? "bg-white/10 text-white font-medium border-l-2 border-[var(--color-primary)] pl-[8px] md:pl-[10px]"
                    : "text-neutral-300 hover:bg-white/5"
                }`
              }
            >
              <Icon size={17} className="shrink-0" />
              <span className="hidden md:inline truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 min-w-0 bg-[var(--color-bg)] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
