import { useMutation } from "@tanstack/react-query";
import { api } from "../services/api";

export interface UploadedImage {
  url: string;
  publicId: string;
}

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("image", file);
      return api
        .post("/admin/uploads/products", formData)
        .then((res) => res.data.image as UploadedImage);
    },
  });
}

export function useDeleteImage() {
  return useMutation({
    mutationFn: (publicId: string) =>
      api.delete(`/admin/uploads/products/${encodeURIComponent(publicId)}`),
  });
}
