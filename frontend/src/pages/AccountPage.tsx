import { useState } from "react";
import { ProfileTab } from "../components/account/ProfileTab";
import { AddressesTab } from "../components/account/AddressesTab";

const TABS = [
  { key: "profile", label: "Profile" },
  { key: "addresses", label: "Saved Addresses" },
] as const;
// "Order History" joins this list in Phase 12 — no orders exist to show yet.

type TabKey = (typeof TABS)[number]["key"];

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("profile");

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-6">
        My Account
      </h1>
      <div className="flex gap-1 border-b border-[var(--color-border)] mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${activeTab === tab.key ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "profile" && <ProfileTab />}
      {activeTab === "addresses" && <AddressesTab />}
    </div>
  );
}
