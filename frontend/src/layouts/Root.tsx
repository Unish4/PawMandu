import { useState, useEffect } from "react";
import { Outlet, Link, NavLink, useLocation, useNavigate } from "react-router";
import {
  ShoppingCart,
  User,
  ShieldCheck,
  Menu,
  X,
  Home,
  Store,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import { SearchInput } from "../components/ui";
import { useUIStore } from "../store/uiStore";
import { useCart } from "../hooks/useCart";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { CartDrawer } from "../components/cart/CartDrawer";

export default function Root() {
  const location = useLocation();
  const navigate = useNavigate();
  const openCart = useUIStore((s) => s.openCart);
  const { data: cart } = useCart();
  const { data: currentUser } = useCurrentUser();
  const cartCount = cart?.items.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const [navSearch, setNavSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && navSearch.trim()) {
      navigate(`/shop?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch("");
      setIsMobileMenuOpen(false);
    }
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors no-underline ${
      isActive
        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
        : "text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-text-primary)]"
    }`;

  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-sm font-medium transition-colors no-underline ${
      isActive
        ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
        : "text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-text-primary)]"
    }`;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-30 flex items-center px-4 sm:px-6 gap-3">
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          className="md:hidden p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-neutral-100 hover:text-[var(--color-text-primary)] focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline"
        >
          <img
            src="/favicon.png"
            alt="PawMandu Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="text-[17px] font-semibold text-[var(--color-text-primary)] tracking-tight">
            PawMandu
          </span>
        </Link>

        <div className="flex-1 max-w-sm mx-auto hidden lg:block">
          <SearchInput
            placeholder="Search for food, toys, essentials..."
            value={navSearch}
            onChange={setNavSearch}
            onKeyDown={handleSearchSubmit}
          />
        </div>

        <nav
          aria-label="Main Navigation"
          className="hidden md:flex items-center gap-1 ml-4"
        >
          <NavLink to="/shop" className={navLinkClasses}>
            Shop
          </NavLink>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-auto">
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center hover:bg-neutral-100 text-[var(--color-text-secondary)]"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-accent)] text-white text-[10px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <Show when="signed-in">
            {currentUser?.role === "admin" && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-neutral-900 text-white hover:bg-neutral-800 no-underline"
              >
                <ShieldCheck size={13} /> Admin
              </Link>
            )}
            <Link
              to="/account"
              aria-label="My account"
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center hover:bg-neutral-100 text-[var(--color-text-secondary)]"
            >
              <User size={20} />
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </Show>

          <Show when="signed-out">
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/sign-in"
                className="text-sm font-medium text-[var(--color-text-secondary)] no-underline px-3 py-1.5 rounded-[var(--radius-md)] hover:bg-neutral-100 hover:text-[var(--color-text-primary)]"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="text-sm font-semibold text-white bg-[var(--color-primary)] no-underline px-3.5 py-1.5 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)]"
              >
                Sign up
              </Link>
            </div>
          </Show>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="mobile-menu"
        aria-label="Mobile menu"
        aria-hidden={!isMobileMenuOpen}
        inert={!isMobileMenuOpen}
        className={`fixed top-0 left-0 bottom-0 z-50 w-4/5 max-w-xs bg-[var(--color-surface)] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="h-16 px-4 border-b border-[var(--color-border)] flex items-center justify-between">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 no-underline"
          >
            <img
              src="/favicon.png"
              alt="PawMandu Logo"
              className="w-6 h-6 object-contain"
            />
            <span className="text-base font-semibold text-[var(--color-text-primary)]">
              PawMandu
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
            className="p-2 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          <div>
            <SearchInput
              placeholder="Search for food, toys..."
              value={navSearch}
              onChange={setNavSearch}
              onKeyDown={handleSearchSubmit}
            />
          </div>

          <nav aria-label="Mobile Navigation" className="space-y-1">
            <NavLink to="/" end className={mobileNavLinkClasses}>
              <Home size={18} />
              Home
            </NavLink>
            <NavLink to="/shop" className={mobileNavLinkClasses}>
              <Store size={18} />
              Shop
            </NavLink>
            <Show when="signed-in">
              <NavLink to="/account" className={mobileNavLinkClasses}>
                <User size={18} />
                My Account
              </NavLink>
              {currentUser?.role === "admin" && (
                <NavLink to="/admin" className={mobileNavLinkClasses}>
                  <ShieldCheck size={18} />
                  Admin Dashboard
                </NavLink>
              )}
            </Show>
          </nav>
        </div>

        <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
          <Show when="signed-in">
            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                Account Profile
              </span>
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
            </div>
          </Show>
          <Show when="signed-out">
            <div className="flex flex-col gap-2">
              <Link
                to="/sign-in"
                className="flex items-center justify-center gap-2 w-full text-center text-sm font-medium text-[var(--color-text-primary)] border border-[var(--color-border)] py-2 rounded-[var(--radius-md)] hover:bg-neutral-50 no-underline"
              >
                <LogIn size={16} />
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="flex items-center justify-center gap-2 w-full text-center text-sm font-semibold text-white bg-[var(--color-primary)] py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)] no-underline"
              >
                <UserPlus size={16} />
                Sign up
              </Link>
            </div>
          </Show>
        </div>
      </aside>

      <main className="flex-1">
        <Outlet />
      </main>
      <CartDrawer />
    </div>
  );
}
