import type { Timestamp } from 'firebase/firestore';
export type RoomStatus = 'available' | 'reserved' | 'occupied' | 'maintenance' | 'inactive';
export interface RoomDocument {
  id: string; propertyId: string; code: string; name: string; floor?: number | undefined; status: RoomStatus;
  monthlyPrice: number; dailyPrice?: number | undefined; hourlyPrice?: number | undefined; depositAmount?: number | undefined; capacity: number;
  size?: string | undefined; facilities: string[]; description: string; coverImageUrl?: string | undefined; imageUrls: string[];
  imageStoragePaths: string[]; isPublished: boolean; isDeleted: boolean; minimumRentalMonths?: number | undefined;
  internalNote?: string | undefined; createdAt: Timestamp; updatedAt: Timestamp;
}
export interface LocalRoomImage { id: string; uri: string; mimeType: string; fileSize?: number | undefined; width?: number | undefined; height?: number | undefined; }
