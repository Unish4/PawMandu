import { Outlet, Link, useLocation } from "react-router";
import { PawIcon, CartIcon } from "../components/icons";
import { SearchInput } from "../components/ui";

export default function Root() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <header className="h-16 bg-[var(--color-surface)] border-b border-[var(--color-border)] sticky top-0 z-30 flex items-center px-6 gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 flex-shrink-0 no-underline"
        >
          <span className="text-[var(--color-primary)]">
            <PawIcon size={26} />
          </span>
          <span className="text-[17px] font-semibold text-[var(--color-text-primary)] tracking-tight">
            PetMandu
          </span>
        </Link>

        <div className="flex-1 max-w-sm mx-auto hidden lg:block">
          <SearchInput placeholder="Search for food, toys, essentials..." />
        </div>

        <nav className="hidden md:flex items-center gap-1 ml-auto mr-2">
          <Link
            to="/shop"
            className={`text-sm px-3 py-1.5 rounded-[var(--radius-sm)] no-underline
              ${
                location.pathname.startsWith("/shop")
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-neutral-100"
              }`}
          >
            Shop
          </Link>
        </nav>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button className="relative w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center hover:bg-neutral-100 text-[var(--color-text-secondary)]">
            <CartIcon size={20} />
          </button>
          <Link to="/account" className="no-underline">
            <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold">
              ?
            </div>
          </Link>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
