import { useState, useEffect } from "react";
import { Outlet, NavLink, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  Package,
  ClipboardList,
  Boxes,
  Menu,
  X,
  Store,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import { UserButton } from "@clerk/react";

const NAV = [
  { to: "/admin", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Orders", Icon: ClipboardList, end: false },
  { to: "/admin/products", label: "Products", Icon: Package, end: false },
  { to: "/admin/inventory", label: "Inventory", Icon: Boxes, end: false },
];

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Close sidebar drawer on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Lock body scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileOpen]);

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <header className="h-16 bg-neutral-900 text-white flex items-center justify-between px-4 md:hidden sticky top-0 z-30 border-b border-white/10 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? "Close sidebar menu" : "Open sidebar menu"}
            aria-expanded={isMobileOpen}
            className="p-2 rounded-lg text-neutral-300 hover:text-white hover:bg-white/10 focus:outline-none transition-colors"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link
            to="/admin"
            className="flex items-center gap-2 no-underline text-white font-semibold text-base"
          >
            <img
              src="/favicon.png"
              alt="PawMandu Logo"
              className="w-6 h-6 object-contain"
            />
            <span>PawMandu Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-md transition-colors no-underline"
          >
            <Store size={14} />
            <span className="hidden min-[380px]:inline">Store</span>
          </Link>
          <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar & Mobile Drawer Sidebar */}
      <aside
        id="admin-sidebar"
        aria-label="Admin Navigation"
        aria-hidden={!isMobileOpen}
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-0 w-64 bg-neutral-900 text-white flex flex-col shrink-0 h-screen transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/10 shrink-0">
          <Link
            to="/admin"
            className="flex items-center gap-2.5 no-underline text-white font-bold text-lg tracking-tight"
          >
            <img
              src="/favicon.png"
              alt="PawMandu Logo"
              className="w-7 h-7 object-contain"
            />
            <span>PawMandu Admin</span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close menu"
            className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Management
          </div>
          {NAV.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setIsMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all no-underline ${
                  isActive
                    ? "bg-[var(--color-primary)] text-white shadow-sm font-semibold"
                    : "text-neutral-300 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-neutral-950/50 shrink-0 space-y-3">
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors no-underline"
          >
            <ArrowLeft size={14} />
            <span>Back to Store Front</span>
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-primary)]" />
              <span className="text-xs font-medium text-neutral-400">Admin Mode</span>
            </div>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8" } }} />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-[var(--color-bg)] flex flex-col min-h-screen md:min-h-[100vh]">
        {/* Desktop Top Header Bar */}
        <header className="hidden md:flex h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] items-center justify-between px-8 sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
            <ShieldCheck size={18} className="text-[var(--color-primary)]" />
            <span>Admin Control Center</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-neutral-100 transition-colors no-underline"
            >
              <Store size={14} />
              <span>View Store</span>
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </div>
        </header>

        {/* Page View */}
        <div className="flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
