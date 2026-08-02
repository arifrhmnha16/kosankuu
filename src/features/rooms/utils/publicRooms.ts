import type { RoomDocument } from '../types';

export interface PublicRoomFilters {
  availableOnly: boolean;
  minimum: string;
  maximum: string;
  facility: string;
}

export function filterPublicRooms(rooms: RoomDocument[], filters: PublicRoomFilters) {
  const minimum = filters.minimum === '' ? null : Number(filters.minimum);
  const maximum = filters.maximum === '' ? null : Number(filters.maximum);
  const facility = filters.facility.trim().toLocaleLowerCase('id-ID');
  return rooms.filter((room) =>
    room.isPublished
    && !room.isDeleted
    && (!filters.availableOnly || room.status === 'available')
    && (minimum === null || Number.isNaN(minimum) || room.monthlyPrice >= minimum)
    && (maximum === null || Number.isNaN(maximum) || room.monthlyPrice <= maximum)
    && (!facility || room.facilities.some((item) => item.toLocaleLowerCase('id-ID').includes(facility)))
  );
}

export function isPublicRoomAvailable(room: RoomDocument | null) {
  return Boolean(room && room.isPublished && !room.isDeleted);
}
