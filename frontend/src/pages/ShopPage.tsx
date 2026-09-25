import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router";
import { Dog, Cat, Fish, X, SlidersHorizontal } from "lucide-react";
import { useProducts, type Product } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useDebounce } from "../hooks/useDebounce";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { ProductCard } from "../components/product/ProductCard";
import { ProductCardSkeleton } from "../components/product/ProductCardSkeleton";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { SearchInput } from "../components/ui";

const SPECIES_TABS = [
  { value: "", label: "All", Icon: null },
  { value: "dog", label: "Dog", Icon: Dog },
  { value: "cat", label: "Cat", Icon: Cat },
  { value: "fish", label: "Fish", Icon: Fish },
];

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "newest", label: "Newest" },
];

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const species = searchParams.get("species") ?? "";

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sort, setSort] = useState("relevance");
  const [inStockOnly, setInStockOnly] = useState(false);
  const urlSearch = searchParams.get("search") ?? "";
  const [search, setSearch] = useState(() => urlSearch);
  const debouncedSearch = useDebounce(search);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const debouncedMinPrice = useDebounce(minPrice);
  const debouncedMaxPrice = useDebounce(maxPrice);
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  useEscapeKey(() => setMobileFiltersOpen(false), mobileFiltersOpen);

  const filterTriggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (mobileFiltersOpen) {
      dialogRef.current?.focus();
    } else if (wasOpenRef.current) {
      filterTriggerRef.current?.focus();
    }
    wasOpenRef.current = mobileFiltersOpen;
  }, [mobileFiltersOpen]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [lastFetchedPage, setLastFetchedPage] = useState<number>(0);
  const [prevFiltersKey, setPrevFiltersKey] = useState<string>("");

  const { data: categories } = useCategories(species || undefined);

  const filters = {
    species: species || undefined,
    category: selectedCategories.length
      ? selectedCategories.join(",")
      : undefined,
    sort: sort === "relevance" ? undefined : sort,
    inStock: inStockOnly || undefined,
    search: debouncedSearch || undefined,
    minPrice: debouncedMinPrice ? Number(debouncedMinPrice) : undefined,
    maxPrice: debouncedMaxPrice ? Number(debouncedMaxPrice) : undefined,
    page,
    limit: 12,
  };

  const { data, isLoading, isFetching, isError, refetch } =
    useProducts(filters);

  const filtersKey = `${species}-${selectedCategories.join(",")}-${sort}-${inStockOnly}-${debouncedSearch}-${debouncedMinPrice}-${debouncedMaxPrice}`;

  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
    setAllProducts([]);
    setLastFetchedPage(0);
  } else if (data && data.pagination.page !== lastFetchedPage) {
    setLastFetchedPage(data.pagination.page);
    setAllProducts((prev) => {
      if (data.pagination.page === 1) return data.products;
      const existingIds = new Set(prev.map((p) => p._id));
      return [...prev, ...data.products.filter((p) => !existingIds.has(p._id))];
    });
  }

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setSearch("");
    setMinPrice("");
    setMaxPrice("");
    setSearchParams({});
  };

  const categoryName = (id: string) =>
    categories?.find((c) => c._id === id)?.name ?? id;

  const chips: { key: string; label: string; onRemove: () => void }[] = [
    ...(species
      ? [
          {
            key: "species",
            label:
              SPECIES_TABS.find((t) => t.value === species)?.label ?? species,
            onRemove: () => setSearchParams({}),
          },
        ]
      : []),
    ...selectedCategories.map((id) => ({
      key: `cat-${id}`,
      label: categoryName(id),
      onRemove: () => toggleCategory(id),
    })),
    ...(inStockOnly
      ? [
          {
            key: "stock",
            label: "In stock only",
            onRemove: () => setInStockOnly(false),
          },
        ]
      : []),
    ...(search
      ? [{ key: "search", label: `"${search}"`, onRemove: () => setSearch("") }]
      : []),
    ...(minPrice || maxPrice
      ? [
          {
            key: "price",
            label: `Rs ${minPrice || "0"}–${maxPrice || "∞"}`,
            onRemove: () => {
              setMinPrice("");
              setMaxPrice("");
            },
          },
        ]
      : []),
  ];

  const filterPanel = (
    <>
      {species && categories && categories.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2.5">
            Category
          </h4>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat._id)}
                  onChange={() => toggleCategory(cat._id)}
                  className="rounded accent-[var(--color-primary)]"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] mb-2.5">
          Price (Rs)
        </h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full h-9 px-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm"
          />
          <span className="text-[var(--color-text-muted)]">–</span>
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full h-9 px-2 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] mb-4 cursor-pointer">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="rounded accent-[var(--color-primary)]"
        />
        In stock only
      </label>

      {chips.length > 0 && (
        <button
          onClick={clearFilters}
          className="text-xs font-semibold text-[var(--color-primary)]"
        >
          Clear all
        </button>
      )}
    </>
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <div className="flex gap-1.5 items-center">
          {SPECIES_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setSelectedCategories([]);
                setSearchParams(tab.value ? { species: tab.value } : {});
              }}
              className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius-sm)] transition-colors ${
                species === tab.value
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                  : "text-[var(--color-text-secondary)] hover:bg-neutral-100"
              }`}
            >
              {tab.Icon && <tab.Icon size={15} />}
              {tab.label}
            </button>
          ))}
          <button
            ref={filterTriggerRef}
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
          >
            <SlidersHorizontal size={14} /> Filters{" "}
            {chips.length > 0 && `(${chips.length})`}
          </button>
        </div>
        <div className="flex gap-3">
          <div className="w-56">
            <SearchInput
              placeholder="Search products"
              value={search}
              onChange={setSearch}
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {chips.map((chip) => (
            <button
              key={chip.key}
              onClick={chip.onRemove}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
            >
              {chip.label}
              <X size={12} />
            </button>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-neutral-50 p-4">
            {filterPanel}
          </div>
        </aside>

        <div>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            {data ? `${data.pagination.total} products` : ""}
          </p>

          {isLoading && page === 1 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : isError ? (
            <ErrorState onRetry={() => refetch()} />
          ) : allProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              description="Try adjusting your filters or search."
              action={
                chips.length > 0 ? (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-semibold text-[var(--color-primary)]"
                  >
                    Clear filters
                  </button>
                ) : undefined
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allProducts.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              {data && page < data.pagination.totalPages && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isFetching}
                    className="px-6 py-2.5 text-sm font-semibold rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-strong)] disabled:opacity-50"
                  >
                    {isFetching ? "Loading..." : "Load more products"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Filter products"
            tabIndex={-1}
            onKeyDown={(e) => {
              if (e.key !== "Tab" || !dialogRef.current) return;
              const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
              );
              if (focusables.length === 0) return;
              const first = focusables[0];
              const last = focusables[focusables.length - 1];
              if (e.shiftKey) {
                if (document.activeElement === first) {
                  e.preventDefault();
                  last.focus();
                }
              } else {
                if (document.activeElement === last) {
                  e.preventDefault();
                  first.focus();
                }
              }
            }}
            className="relative w-full max-h-[80vh] overflow-y-auto bg-[var(--color-surface)] rounded-t-[var(--radius-xl)] p-5 outline-none"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                Filters
              </h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
              >
                <X size={20} className="text-[var(--color-text-secondary)]" />
              </button>
            </div>
            {filterPanel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full h-11 mt-5 rounded-[var(--radius-md)] bg-[var(--color-primary)] text-white text-sm font-semibold"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
