import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  addressSchema,
  type AddressFormValues,
} from "../../schemas/addressSchema";
import {
  useCreateAddress,
  useUpdateAddress,
  type Address,
} from "../../hooks/useAddresses";
import axios from "axios";
import { useEscapeKey } from "../../hooks/useEscapeKey";

interface AddressFormModalProps {
  open: boolean;
  onClose: () => void;
  existing?: Address;
}

const CITIES = ["Kathmandu", "Lalitpur", "Bhaktapur"] as const;

export function AddressFormModal({
  open,
  onClose,
  existing,
}: AddressFormModalProps) {
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    values: existing ?? {
      label: "Home",
      city: "Kathmandu",
      area: "",
      landmark: "",
      phone: "",
      isDefault: false,
    },
  });

  const handleCancel = () => {
    reset();
    onClose();
  };

  useEscapeKey(handleCancel, open);

  if (!open) return null;

  const onSubmit = (data: AddressFormValues) => {
    const mutation = existing
      ? updateAddress.mutateAsync({ id: existing._id, data })
      : createAddress.mutateAsync(data);

    mutation
      .then(() => {
        toast.success(existing ? "Address updated" : "Address added");
        reset();
        onClose();
      })
      .catch((err) =>
        toast.error(
          (axios.isAxiosError(err) && err.response?.data?.message) ||
            err.message,
        ),
      );
  };

  const isPending = createAddress.isPending || updateAddress.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-[0_20px_48px_rgba(28,25,23,0.16)]">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
          {existing ? "Edit address" : "Add new address"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Label
            </label>
            <input
              {...register("label")}
              placeholder="Home, Work..."
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
            {errors.label && (
              <p className="text-xs text-red-600 mt-1">
                {errors.label.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              City
            </label>
            <select
              {...register("city")}
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.city && (
              <p className="text-xs text-red-600 mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Area / Tole
            </label>
            <input
              {...register("area")}
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
            {errors.area && (
              <p className="text-xs text-red-600 mt-1">{errors.area.message}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Landmark (optional)
            </label>
            <input
              {...register("landmark")}
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
              Phone
            </label>
            <input
              {...register("phone")}
              placeholder="98XXXXXXXX"
              className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm"
            />
            {errors.phone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              {...register("isDefault")}
              className="rounded"
            />
            Set as default address
          </label>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] disabled:opacity-40"
            >
              {isPending ? "Saving..." : "Save address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
