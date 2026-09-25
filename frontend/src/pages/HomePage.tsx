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
  "Fast delivery inside Valley",
  "Genuine products",
  "Order support on WhatsApp",
];

const WHY_PAWMANDU = [
  { Icon: Truck, label: "Fast delivery inside Valley" },
  { Icon: ShieldCheck, label: "Genuine, brand-sourced products" },
  { Icon: MessageCircle, label: "Real support on WhatsApp" },
  { Icon: PackageCheck, label: "Small catalogue, carefully chosen" },
];

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20 text-center md:text-left grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] mb-4">
            Kathmandu Valley Delivery
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)] mb-4 leading-tight">
            Everything your pet needs, at{" "}
            <span className="text-[var(--color-primary)]">your door.</span>
          </h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] mb-6 max-w-lg mx-auto md:mx-0">
            Genuine pet products for dogs, cats, and fish. Delivered fast across Kathmandu Valley.
          </p>
          
          <div className="mb-6">
            <Link
              to="/shop"
              className="inline-flex items-center justify-center bg-[var(--color-primary)] text-white px-7 py-3.5 rounded-[var(--radius-md)] text-base font-semibold no-underline shadow-sm hover:bg-[var(--color-primary-dark)] transition-all"
            >
              Shop now
            </Link>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 text-xs sm:text-sm text-[var(--color-text-secondary)] font-medium">
            {TRUST_ROW.map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-[var(--color-primary)] flex-shrink-0" />
                <span>{item}</span>
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

      {/* Species Categories */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16 grid grid-cols-3 gap-3 sm:gap-6">
        {SPECIES.map(({ slug, label, subtitle, Icon, color, bg }) => (
          <Link
            key={slug}
            to={`/shop?species=${slug}`}
            className="border border-[var(--color-border)] rounded-2xl p-4 sm:p-6 text-center no-underline hover:border-[var(--color-border-strong)] hover:shadow-md transition-all bg-[var(--color-surface)] flex flex-col items-center justify-between"
          >
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 mx-auto mb-2.5 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: bg }}
            >
              <Icon size={24} style={{ color }} />
            </div>
            <div className="text-sm sm:text-base md:text-lg font-bold text-[var(--color-text-primary)]">
              {label}
            </div>
            <div className="text-[11px] sm:text-xs text-[var(--color-text-secondary)] mt-0.5 line-clamp-1">
              {subtitle}
            </div>
          </Link>
        ))}
      </section>

      {/* How Ordering Works Section */}
      <section className="bg-neutral-50/80 py-12 sm:py-16 border-y border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-[var(--color-text-primary)] mb-2">
            How ordering works
          </h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] text-center mb-8 sm:mb-10 max-w-md mx-auto">
            Get your pet essentials delivered in 3 simple steps
          </p>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {STEPS.map(({ n, title, Icon }) => (
              <div
                key={n}
                className="bg-[var(--color-surface)] border border-neutral-200/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center md:items-start md:text-left shadow-xs hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[var(--color-primary-light)] flex items-center justify-center mb-4 text-[var(--color-primary)]">
                  <Icon size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div className="text-[var(--color-primary)] text-xs sm:text-sm font-extrabold tracking-wider uppercase mb-1.5">
                  Step {n}
                </div>
                <div className="text-lg sm:text-xl font-bold text-[var(--color-text-primary)] leading-snug">
                  {title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-primary)] py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-white text-xl sm:text-2xl font-bold text-center mb-8">
            Why shop with PawMandu?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {WHY_PAWMANDU.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center text-white bg-white/10 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border border-white/10 shadow-xs"
              >
                <Icon size={26} className="mb-2.5 text-white" />
                <span className="text-xs sm:text-sm font-medium leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

