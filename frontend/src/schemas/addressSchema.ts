import { z } from "zod";

export const addressSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(30),
  city: z.enum(["Kathmandu", "Lalitpur", "Bhaktapur"], {
    message: "Select a city",
  }),
  area: z.string().trim().min(1, "Area is required").max(100),
  landmark: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^(97|98)\d{8}$/, "Enter a valid 10-digit Nepali mobile number"),
  isDefault: z.boolean().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
