import { loginSchema } from '@/features/auth/schemas';
import { mapFirebaseAuthError } from '@/services/firebase/errors';

describe('authentication validation', () => {
  it('rejects an invalid email and empty password', () => {
    const result = loginSchema.safeParse({ email: 'bukan-email', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.flatten().fieldErrors).toEqual(expect.objectContaining({ email: ['Format email tidak valid.'], password: ['Password wajib diisi.'] }));
  });

  it('maps Firebase errors to safe Indonesian messages', () => {
    expect(mapFirebaseAuthError({ code: 'auth/invalid-credential', message: 'raw firebase detail' }).message).toBe('Email atau password salah.');
    expect(mapFirebaseAuthError({ code: 'auth/network-request-failed', message: 'raw' }).message).toBe('Tidak dapat terhubung ke internet.');
  });
});
