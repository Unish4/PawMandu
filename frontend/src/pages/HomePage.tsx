import { Link } from "react-router";
import { PawIcon } from "../components/icons";

const SPECIES = [
  { slug: "dog", label: "Dog", subtitle: "Food, toys & more" },
  { slug: "cat", label: "Cat", subtitle: "Food, litter & more" },
  { slug: "fish", label: "Fish", subtitle: "Food & essentials" },
];

const STEPS = [
  { n: "01", title: "Browse & choose" },
  { n: "02", title: "Place your order" },
  { n: "03", title: "Pay via WhatsApp & we deliver" },
];

export default function HomePage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
            Kathmandu Valley delivery
          </span>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Everything your pet needs, at{" "}
            <span className="text-[var(--color-primary)]">your door.</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mb-6">
            Genuine pet products for dogs, cats, and fish — flat-rate delivery
            across the Valley.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold no-underline"
          >
            Shop now
          </Link>
        </div>
        <div className="hidden md:flex items-center justify-center text-[var(--color-primary)]">
          <PawIcon size={160} />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-3 gap-4">
        {SPECIES.map((s) => (
          <Link
            key={s.slug}
            to={`/shop?species=${s.slug}`}
            className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center no-underline hover:border-[var(--color-border-strong)] transition-colors"
          >
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">
              {s.label}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">
              {s.subtitle}
            </div>
          </Link>
        ))}
      </section>

      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-center mb-10">
            How ordering works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((step) => (
              <div
                key={step.n}
                className="bg-neutral-50 rounded-[var(--radius-lg)] p-8"
              >
                <div className="text-[var(--color-primary)] text-sm font-bold mb-2">
                  {step.n}
                </div>
                <div className="font-medium">{step.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
