const messages: Record<string, string> = {
  'permission-denied': 'Anda tidak memiliki izin untuk mengubah kamar ini.',
  unavailable: 'Layanan sedang tidak tersedia. Periksa koneksi lalu coba lagi.',
  'storage/unauthorized': 'Anda tidak memiliki izin untuk mengunggah foto kamar.',
  'storage/retry-limit-exceeded': 'Upload terhenti. Periksa koneksi lalu coba lagi.',
  'storage/quota-exceeded': 'Kapasitas penyimpanan Firebase telah habis.',
};

export function mapRoomError(error: unknown) {
  const code = typeof error === 'object' && error && 'code' in error && typeof error.code === 'string'
    ? error.code.replace(/^firestore\//, '')
    : '';
  if (code && messages[code]) return messages[code];
  return error instanceof Error && error.message
    ? error.message
    : 'Terjadi kendala. Coba kembali.';
}
