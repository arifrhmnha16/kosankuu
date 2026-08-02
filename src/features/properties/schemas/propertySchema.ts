import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

const optionalText = z.string().trim().min(1).optional();
export const propertyDataSchema = z.object({
  name: z.string().trim().min(1), shortDescription: z.string().trim().min(1), description: optionalText,
  address: z.string().trim().min(1), village: optionalText, district: optionalText, regency: optionalText,
  province: optionalText, postalCode: optionalText, locationLabel: z.string().trim().min(1),
  latitude: z.number().optional(), longitude: z.number().optional(), mapsUrl: optionalText,
  whatsappNumber: optionalText, email: z.string().email().optional(), heroImageUrl: z.string().url().optional(),
  galleryImageUrls: z.array(z.string().url()), facilities: z.array(z.string().trim().min(1)),
  highlights: z.array(z.object({ id: z.string().min(1), title: z.string().min(1), description: z.string().min(1), icon: optionalText })),
  faq: z.array(z.object({ id: z.string().min(1), question: z.string().min(1), answer: z.string().min(1) })),
  isPublished: z.boolean(), createdAt: z.instanceof(Timestamp), updatedAt: z.instanceof(Timestamp),
});

export function parsePropertyDocument(id: string, data: unknown) {
  const result = propertyDataSchema.safeParse(data);
  return result.success ? { id, ...result.data } : null;
}
