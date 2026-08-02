const authMessages: Record<string, string> = {
  'auth/invalid-credential': 'Email atau password salah.',
  'auth/wrong-password': 'Email atau password salah.',
  'auth/user-not-found': 'Email atau password salah.',
  'auth/user-disabled': 'Akun ini telah dinonaktifkan.',
  'auth/too-many-requests': 'Terlalu banyak percobaan. Coba kembali beberapa saat lagi.',
  'auth/network-request-failed': 'Tidak dapat terhubung ke internet.',
  'auth/invalid-email': 'Format email tidak valid.',
  'auth/operation-not-allowed': 'Login email dan password belum diaktifkan.',
};

export interface AppAuthError { code: string; message: string; cause: unknown; }

export function mapFirebaseAuthError(error: unknown): AppAuthError {
  const code = typeof error === 'object' && error && 'code' in error && typeof error.code === 'string' ? error.code : 'auth/unknown';
  return { code, message: authMessages[code] ?? 'Terjadi kendala saat memproses akun. Coba lagi.', cause: error };
}
