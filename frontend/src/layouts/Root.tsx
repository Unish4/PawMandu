import { Outlet, Link, useLocation } from "react-router";
import { PawPrint, ShoppingCart } from "lucide-react";
import { Show, UserButton } from "@clerk/react";
import { SearchInput } from "../components/ui";
import { User } from "lucide-react";

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
            <PawPrint size={26} />
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

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Cart count is hardcoded until Phase 9 wires real cart state */}
          <button className="relative w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center hover:bg-neutral-100 text-[var(--color-text-secondary)]">
            <ShoppingCart size={20} />
          </button>

          <Show when="signed-in">
            <Link
              aria-label="My Account"
              to="/account"
              className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center hover:bg-neutral-100 text-[var(--color-text-secondary)]"
            >
              <User size={20} />
            </Link>
            <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
          </Show>

          <Show when="signed-out">
            <div className="flex items-center gap-1.5">
              <Link
                to="/sign-in"
                className="hidden sm:inline text-sm font-medium text-[var(--color-text-secondary)] no-underline px-3 py-2 hover:text-[var(--color-text-primary)]"
              >
                Sign in
              </Link>
              <Link
                to="/sign-up"
                className="text-sm font-semibold text-white bg-[var(--color-primary)] no-underline px-4 py-2 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-dark)]"
              >
                Sign up
              </Link>
            </div>
          </Show>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
