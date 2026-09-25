import { SignUp } from "@clerk/react";
import { Link } from "react-router";
import { Truck, ShieldCheck, MessageCircle } from "lucide-react";

export default function SignUpPage() {
  return (
    <>
      <style>{`
        [class*="cl-card"] {
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          background: transparent !important;
          padding: 0 !important;
        }
        [class*="cl-rootBox"] {
          width: 100% !important;
          max-width: 100% !important;
          margin: 0 !important;
        }
        [class*="cl-cardBox"] {
          width: 100% !important;
          max-width: 100% !important;
          box-shadow: none !important;
          margin: 0 !important;
        }
        [class*="cl-footer"] {
          margin: 0 !important;
          width: 100% !important;
          background: transparent !important;
          justify-content: center !important;
        }
        [class*="cl-footerAction"] {
          justify-content: center !important;
          text-align: center !important;
        }
        [class*="cl-footerActionText"],
        [class*="cl-footerActionLink"] {
          text-align: center !important;
        }
        [class*="cl-main"] {
          width: 100% !important;
          max-width: 100% !important;
        }
      `}</style>
      <div className="min-h-screen bg-[var(--color-bg)]">
        <header className="h-16 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <img
                src="/favicon.png"
                alt="PawMandu Logo"
                className="w-6 h-6 object-contain"
              />
              <span className="text-[17px] font-semibold text-[var(--color-text-primary)]">
                PawMandu
              </span>
            </Link>
            <Link
              to="/sign-in"
              className="text-sm text-[var(--color-text-secondary)] no-underline hover:text-[var(--color-text-primary)]"
            >
              Already have an account?
            </Link>
          </div>
        </header>

        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center gap-8 lg:gap-12 px-4 py-8 sm:px-6 lg:flex-row">
          <div className="hidden lg:block w-full max-w-xl">
            <h1 className="mb-4 text-center text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-primary)] lg:text-left">
              Everything your pet needs,{" "}
              <span className="text-[var(--color-primary)]">at your door.</span>
            </h1>
            <p className="mb-8 text-center text-sm sm:text-base text-[var(--color-text-secondary)] lg:text-left">
              Create an account to order and track deliveries across Kathmandu
              Valley.
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
            <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6 shadow-[0_20px_48px_rgba(28,25,23,0.08)]">
              <h2 className="mb-1 text-center text-2xl font-bold text-[var(--color-text-primary)]">
                Create your account
              </h2>
              <p className="mb-6 text-center text-sm text-[var(--color-text-secondary)]">
                Start shopping with PawMandu.
              </p>

              <SignUp
                routing="path"
                path="/sign-up"
                signInUrl="/sign-in"
                fallbackRedirectUrl="/"
                appearance={{
                  variables: {
                    colorPrimary: "#0f766e",
                    colorBackground: "transparent",
                    colorForeground: "#1c1917",
                    colorMutedForeground: "#57534e",
                    colorInput: "#faf9f6",
                    colorInputForeground: "#1c1917",
                    colorDanger: "#b91c1c",
                    borderRadius: "10px",
                  },
                  elements: {
                    rootBox: "!w-full !max-w-full !m-0",
                    cardBox: "!w-full !max-w-full !shadow-none !m-0",
                    card: "!bg-transparent !shadow-none !border-0 !p-0 !m-0 !w-full !max-w-full",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "!bg-neutral-50 !border !border-[var(--color-border)] hover:!bg-neutral-100 !text-[var(--color-text-primary)] transition-all duration-200 rounded-xl h-11 !w-full",
                    socialButtonsBlockButtonText:
                      "!text-[var(--color-text-primary)] !font-medium",
                    dividerLine: "!bg-[var(--color-border)]",
                    dividerText: "!text-[var(--color-text-muted)] text-sm",
                    formFieldLabel:
                      "!text-[var(--color-text-primary)] text-sm font-medium mb-1.5",
                    formFieldInput:
                      "!bg-[#faf9f6] !border !border-[var(--color-border)] !text-[var(--color-text-primary)] placeholder:!text-[var(--color-text-muted)] h-11 rounded-xl focus:!border-[var(--color-primary)] focus:!ring-2 focus:!ring-[var(--color-primary-light)] transition-all duration-200",
                    formButtonPrimary:
                      "h-11 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] !text-white font-semibold shadow-xs transition-all duration-200 !w-full",
                    footer: "!mx-0 !w-full !justify-center !bg-transparent",
                    footerAction: "!mx-0 !justify-center text-center",
                    footerActionText: "!text-[var(--color-text-secondary)]",
                    footerActionLink:
                      "!text-[var(--color-primary)] hover:underline font-medium",
                  },
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
