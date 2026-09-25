import { SignIn } from "@clerk/react";
import { Link } from "react-router";
import { Truck, ShieldCheck, MessageCircle, PawPrint } from "lucide-react";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, rgba(15,118,110,0.07), transparent 55%), var(--color-bg)",
      }}
    >
      <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 no-underline">
            <span className="text-[var(--color-primary)]">
              <PawPrint size={24} />
            </span>
            <span className="text-[17px] font-semibold text-[var(--color-text-primary)]">
              PawMandu
            </span>
          </Link>
          <Link
            to="/sign-up"
            className="text-sm text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)]"
          >
            Don't have an account?
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-12 lg:flex-row">
        <div className="w-full max-w-xl">
          <h1 className="mb-4 text-center text-4xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-left">
            Welcome back to{" "}
            <span className="text-[var(--color-primary)]">PawMandu.</span>
          </h1>
          <p className="mb-8 text-center text-[var(--color-text-secondary)] sm:text-left">
            Sign in to track your orders and manage your saved addresses.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-light)]">
                <Truck className="text-[var(--color-primary)]" size={20} />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                Fast delivery inside Valley
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Anywhere across Kathmandu Valley.
              </p>
            </div>
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-light)]">
                <ShieldCheck
                  className="text-[var(--color-primary)]"
                  size={20}
                />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                Genuine products
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Sourced and stocked with care.
              </p>
            </div>
            <div className="col-span-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-center">
              <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary-light)]">
                <MessageCircle
                  className="text-[var(--color-primary)]"
                  size={20}
                />
              </div>
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                Real WhatsApp support
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Order questions answered by our team, not a bot.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_20px_48px_rgba(28,25,23,0.08)]">
            <h2 className="mb-1 text-center text-2xl font-bold text-[var(--color-text-primary)]">
              Sign in to your account
            </h2>
            <p className="mb-6 text-center text-sm text-[var(--color-text-secondary)]">
              Welcome back — please enter your details.
            </p>

            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/"
              appearance={{
                variables: {
                  colorPrimary: "#0f766e",
                  colorBackground: "#ffffff",
                  colorForeground: "#1c1917",
                  colorMutedForeground: "#57534e",
                  colorInput: "#faf9f6",
                  colorInputForeground: "#1c1917",
                  colorDanger: "#b91c1c",
                  borderRadius: "10px",
                },
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none border-0 p-0 w-full bg-transparent",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  footer: "justify-center",
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
