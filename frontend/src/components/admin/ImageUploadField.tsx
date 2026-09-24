import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import toast from "react-hot-toast";
import {
  useUploadImage,
  useDeleteImage,
  type UploadedImage,
} from "../../hooks/useUploadImage";
import { ConfirmDialog } from "../ConfirmDialog";

interface ImageUploadFieldProps {
  value: UploadedImage | null;
  onChange: (image: UploadedImage | null) => void;
  originalPublicId?: string | null;
}

export function ImageUploadField({
  value,
  onChange,
  originalPublicId = null,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadImage();
  const deleteImage = useDeleteImage();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isFresh = (publicId: string) => publicId !== originalPublicId;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previousValue = value;

    upload.mutate(file, {
      onSuccess: (image) => {
        onChange(image);
        if (previousValue && isFresh(previousValue.publicId)) {
          deleteImage.mutate(previousValue.publicId);
        }
      },
      onError: (err) => toast.error(err.message),
    });

    e.target.value = "";
  };

  const handleRemoveConfirmed = () => {
    if (value && isFresh(value.publicId)) {
      deleteImage.mutate(value.publicId);
    }
    onChange(null);
    setConfirmOpen(false);
  };

  if (value) {
    return (
      <>
        <div className="relative w-32 h-32">
          <img
            src={value.url}
            alt="Product"
            className="w-full h-full object-cover rounded-[var(--radius-md)] border border-[var(--color-border)]"
          />
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:text-red-600"
          >
            <X size={14} />
          </button>
        </div>
        <ConfirmDialog
          open={confirmOpen}
          title="Remove this image?"
          description="This deletes it from storage — you'll need to re-upload if you change your mind."
          confirmLabel="Remove"
          onConfirm={handleRemoveConfirmed}
          onCancel={() => setConfirmOpen(false)}
        />
      </>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={upload.isPending}
        className="w-32 h-32 rounded-[var(--radius-md)] border-2 border-dashed border-[var(--color-border)] flex flex-col items-center justify-center gap-1.5 text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
      >
        <Upload size={20} />
        <span className="text-xs">
          {upload.isPending ? "Uploading..." : "Upload image"}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
