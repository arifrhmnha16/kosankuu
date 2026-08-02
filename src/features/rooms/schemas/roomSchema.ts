import { Timestamp } from 'firebase/firestore';
import { z } from 'zod';

export const roomStatuses = ['available', 'reserved', 'occupied', 'maintenance', 'inactive'] as const;
const optionalNumber = z.preprocess((value) => value === '' || value == null ? undefined : Number(value), z.number().nonnegative().optional());
const optionalInteger = z.preprocess((value) => value === '' || value == null ? undefined : Number(value), z.number().int().optional());
export const roomFormSchema = z.object({
  code: z.string().trim().min(1, 'Kode kamar wajib diisi.').max(30), name: z.string().trim().min(1, 'Nama kamar wajib diisi.').max(100),
  floor: optionalInteger, status: z.enum(roomStatuses), monthlyPrice: z.preprocess(Number, z.number().nonnegative('Harga tidak boleh negatif.')),
  dailyPrice: optionalNumber, hourlyPrice: optionalNumber, depositAmount: optionalNumber,
  capacity: z.preprocess(Number, z.number().int().min(1, 'Kapasitas minimal 1.')),
  size: z.string().trim().optional(), facilitiesText: z.string().default(''),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.').max(2000),
  minimumRentalMonths: z.preprocess((value) => value === '' || value == null ? undefined : Number(value), z.number().int().min(1).optional()),
  internalNote: z.string().trim().max(1000).optional(), isPublished: z.boolean(),
}).superRefine((value, context) => {
  const facilities = value.facilitiesText.split(',').map((item) => item.trim()).filter(Boolean);
  if (facilities.length > 20) context.addIssue({ code: 'custom', path: ['facilitiesText'], message: 'Maksimum 20 fasilitas.' });
});
export type RoomFormInput = z.input<typeof roomFormSchema>;
export type RoomFormValues = z.output<typeof roomFormSchema>;

export const roomDataSchema = z.object({
  propertyId: z.string().min(1), code: z.string().min(1), name: z.string().min(1), floor: z.number().int().optional(), status: z.enum(roomStatuses),
  monthlyPrice: z.number().nonnegative(), dailyPrice: z.number().nonnegative().optional(), hourlyPrice: z.number().nonnegative().optional(),
  depositAmount: z.number().nonnegative().optional(), capacity: z.number().int().min(1), size: z.string().optional(), facilities: z.array(z.string().min(1)),
  description: z.string().min(1), coverImageUrl: z.string().url().optional(), imageUrls: z.array(z.string().url()), imageStoragePaths: z.array(z.string()).default([]),
  isPublished: z.boolean(), isDeleted: z.boolean(), minimumRentalMonths: z.number().int().min(1).optional(), internalNote: z.string().optional(),
  createdAt: z.instanceof(Timestamp), updatedAt: z.instanceof(Timestamp),
});
export function parseRoomDocument(id: string, data: unknown) { const result = roomDataSchema.safeParse(data); return result.success ? { id, ...result.data } : null; }
export function roomFormToData(values: RoomFormValues) { return { ...values, facilities: values.facilitiesText.split(',').map((item) => item.trim()).filter(Boolean), facilitiesText: undefined }; }
