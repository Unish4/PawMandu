import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  phone: z
    .string()
    .regex(/^(97|98)\d{8}$/, "Enter a valid 10-digit Nepali mobile number")
    .optional()
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
