import { z } from "zod";

export const mediaSchema = z.object({
  publicId: z.string(), secureUrl: z.string().url(), width: z.number(), height: z.number(),
  format: z.string(), bytes: z.number().max(8_000_000), resourceType: z.literal("image"),
  altText: z.string(), sortOrder: z.number(),
});

export const bookingInput = z.object({
  roomId: z.string().min(1), tenantId: z.string().min(1).optional(),
  rentalType: z.enum(["hourly", "daily", "monthly", "yearly"]),
  startAt: z.string().datetime(), endAt: z.string().datetime(),
}).refine((value) => new Date(value.endAt) > new Date(value.startAt), {
  message: "Waktu selesai harus setelah waktu mulai.", path: ["endAt"],
});

export const complaintInput = z.object({
  title: z.string().min(5).max(120), category: z.string().min(2).max(50),
  description: z.string().min(10).max(3000), priority: z.enum(["low", "medium", "high", "urgent"]),
  roomId: z.string().optional(), attachments: z.array(mediaSchema).max(5).default([]),
});

export const uploadInput = z.object({
  purpose: z.enum(["room", "gallery", "avatar", "complaint", "payment", "property"]),
  resourceId: z.string().min(1).max(120), mimeType: z.enum(["image/jpeg", "image/png", "image/webp"]),
  bytes: z.number().int().positive().max(8_000_000),
});
