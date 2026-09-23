import { Link } from "react-router";
import {
  Dog,
  Cat,
  Fish,
  PawPrint,
  Truck,
  ShieldCheck,
  MessageCircle,
  PackageCheck,
  Search,
  ShoppingCart,
  CheckCircle2,
} from "lucide-react";

const SPECIES = [
  {
    slug: "dog",
    label: "Dog",
    subtitle: "Food, toys & more",
    Icon: Dog,
    color: "var(--color-species-dog)",
    bg: "var(--color-species-dog-bg)",
  },
  {
    slug: "cat",
    label: "Cat",
    subtitle: "Food, litter & more",
    Icon: Cat,
    color: "var(--color-species-cat)",
    bg: "var(--color-species-cat-bg)",
  },
  {
    slug: "fish",
    label: "Fish",
    subtitle: "Food & essentials",
    Icon: Fish,
    color: "var(--color-species-fish)",
    bg: "var(--color-species-fish-bg)",
  },
];

const STEPS = [
  { n: "01", title: "Browse & choose", Icon: Search },
  { n: "02", title: "Place your order", Icon: ShoppingCart },
  { n: "03", title: "Pay via WhatsApp & we deliver", Icon: MessageCircle },
];

const TRUST_ROW = [
  "Flat Rs 100 delivery",
  "Genuine products",
  "Order support on WhatsApp",
];

const WHY_PETMANDU = [
  { Icon: Truck, label: "Flat Rs 100 delivery across the Valley" },
  { Icon: ShieldCheck, label: "Genuine, brand-sourced products" },
  { Icon: MessageCircle, label: "Real support on WhatsApp" },
  { Icon: PackageCheck, label: "Small catalogue, carefully chosen" },
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
            className="inline-block bg-[var(--color-primary)] text-white px-6 py-3 rounded-[var(--radius-md)] text-sm font-semibold no-underline mb-6"
          >
            Shop now
          </Link>

          <div className="flex flex-col gap-2">
            {TRUST_ROW.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]"
              >
                <CheckCircle2
                  size={16}
                  className="text-[var(--color-primary)]"
                />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-72 h-72 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[var(--color-primary-light)]" />
            <PawPrint
              size={140}
              className="relative text-[var(--color-primary)]"
            />
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16 grid grid-cols-3 gap-4">
        {SPECIES.map(({ slug, label, subtitle, Icon, color, bg }) => (
          <Link
            key={slug}
            to={`/shop?species=${slug}`}
            className="border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center no-underline hover:border-[var(--color-border-strong)] hover:shadow-[0_4px_16px_rgba(28,25,23,0.06)] transition-all"
          >
            <div
              className="w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <Icon size={22} style={{ color }} />
            </div>
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">
              {label}
            </div>
            <div className="text-xs text-[var(--color-text-secondary)] mt-1">
              {subtitle}
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
            {STEPS.map(({ n, title, Icon }) => (
              <div
                key={n}
                className="bg-neutral-50 rounded-[var(--radius-lg)] p-8"
              >
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="text-[var(--color-primary)] text-sm font-bold mb-1">
                  {n}
                </div>
                <div className="font-medium">{title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {WHY_PETMANDU.map(({ Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center text-white"
            >
              <Icon size={26} className="mb-3" />
              <span className="text-sm">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
