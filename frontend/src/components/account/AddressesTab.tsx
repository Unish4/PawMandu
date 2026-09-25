import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useAddresses,
  useDeleteAddress,
  type Address,
} from "../../hooks/useAddresses";
import { AddressFormModal } from "./AddressFormModal";
import { ConfirmDialog } from "../ConfirmDialog";
import { ErrorState } from "../ErrorState";
import LoadingSpinner from "../LoadingSpinner";

export function AddressesTab() {
  const { data: addresses, isLoading, isError, refetch } = useAddresses();
  const deleteAddress = useDeleteAddress();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Address | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!deletingId) return;
    deleteAddress.mutate(deletingId, {
      onSuccess: () => toast.success("Address removed"),
      onError: (err) => toast.error(err.message),
    });
    setDeletingId(null);
  };

  if (isLoading)
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        {addresses?.map((address) => (
          <div
            key={address._id}
            className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {address.label}
                </span>
                {address.isDefault && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary)]">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditing(address);
                    setFormOpen(true);
                  }}
                  className="p-1.5 rounded-[var(--radius-sm)] hover:bg-neutral-100 text-[var(--color-text-secondary)]"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${address.label} address`}
                  onClick={() => setDeletingId(address._id)}
                  className="p-1.5 rounded-[var(--radius-sm)] hover:bg-neutral-100 text-[var(--color-text-secondary)]"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              {address.area}, {address.city}
              {address.landmark && ` — ${address.landmark}`}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {address.phone}
            </p>
          </div>
        ))}

        <button
          onClick={() => {
            setEditing(undefined);
            setFormOpen(true);
          }}
          className="rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] p-4 flex flex-col items-center justify-center gap-2 text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] min-h-[120px]"
        >
          <Plus size={20} />
          <span className="text-sm font-medium">Add new address</span>
        </button>
      </div>

      {addresses?.length === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] mt-2">
          No saved addresses yet — add one to speed up checkout.
        </p>
      )}

      <AddressFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        existing={editing}
      />
      <ConfirmDialog
        open={!!deletingId}
        title="Delete this address?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
