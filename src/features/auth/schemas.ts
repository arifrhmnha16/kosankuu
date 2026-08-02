import { z } from 'zod';

export const emailSchema = z.string().trim().min(1, 'Email wajib diisi.').email('Format email tidak valid.');
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1, 'Password wajib diisi.') });
export const forgotPasswordSchema = z.object({ email: emailSchema });
export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
