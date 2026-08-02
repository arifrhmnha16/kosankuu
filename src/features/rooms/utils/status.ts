import type { SemanticColor } from '@/design/colors';
import type { RoomStatus } from '../types';
export const roomStatusLabels: Record<RoomStatus, string> = { available: 'Tersedia', reserved: 'Dipesan', occupied: 'Terisi', maintenance: 'Perbaikan', inactive: 'Nonaktif' };
export const roomStatusTones: Record<RoomStatus, SemanticColor> = { available: 'success', reserved: 'pending', occupied: 'info', maintenance: 'warning', inactive: 'danger' };
