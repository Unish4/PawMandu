import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-[var(--color-text-secondary)] mb-6">
        The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="text-[var(--color-primary)] font-medium no-underline"
      >
        Back to home
      </Link>
    </div>
  );
}
