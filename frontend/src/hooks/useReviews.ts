import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../services/api";

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewerName: string;
}

interface MyReviewStatus {
  canReview: boolean;
  existingReview: { _id: string; rating: number; comment?: string } | null;
}

export function useProductReviews(productId: string) {
  return useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () =>
      api.get(`/products/${productId}/reviews`).then((res) => res.data.reviews),
  });
}

export function useMyReviewStatus(productId: string, enabled: boolean) {
  return useQuery<MyReviewStatus>({
    queryKey: ["my-review-status", productId],
    queryFn: () =>
      api.get(`/products/${productId}/reviews/me`).then((res) => res.data),
    enabled,
  });
}

function invalidateReviewData(
  queryClient: ReturnType<typeof useQueryClient>,
  productId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
  queryClient.invalidateQueries({ queryKey: ["my-review-status", productId] });
  queryClient.invalidateQueries({ queryKey: ["product"] });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; comment?: string }) =>
      api
        .post(`/products/${productId}/reviews`, data)
        .then((res) => res.data.review),
    onSuccess: () => invalidateReviewData(queryClient, productId),
  });
}

export function useUpdateReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { rating?: number; comment?: string };
    }) => api.patch(`/reviews/${id}`, data).then((res) => res.data.review),
    onSuccess: () => invalidateReviewData(queryClient, productId),
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => invalidateReviewData(queryClient, productId),
  });
}
