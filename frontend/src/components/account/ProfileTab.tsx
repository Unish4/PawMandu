import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  profileSchema,
  type ProfileFormValues,
} from "../../schemas/profileSchema";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { ErrorState } from "../ErrorState";
import LoadingSpinner from "../LoadingSpinner";

export function ProfileTab() {
  const { data: user, isLoading, isError, refetch } = useCurrentUser();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone ?? "" });
  }, [user, reset]);

  const onSubmit = (data: ProfileFormValues) => {
    updateProfile.mutate(data, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (err) => toast.error(err.message),
    });
  };

  if (isLoading)
    return (
      <div className="py-8 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1"
        >
          Full name
        </label>
        <input
          id="name"
          {...register("name")}
          className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="phone"
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1"
        >
          Phone
        </label>
        <input
          id="phone"
          {...register("phone")}
          placeholder="98XXXXXXXX"
          className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm focus:outline-none focus:border-[var(--color-primary)]"
        />
        {errors.phone && (
          <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1"
        >
          Email
        </label>
        <input
          id="email"
          value={user?.email ?? ""}
          disabled
          className="w-full h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm bg-neutral-50 text-[var(--color-text-muted)]"
        />
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Managed through your sign-in provider.
        </p>
      </div>

      <button
        type="submit"
        disabled={!isDirty || updateProfile.isPending}
        className="px-5 py-2.5 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-[var(--radius-md)] disabled:opacity-40"
      >
        {updateProfile.isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
