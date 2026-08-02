import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOwnerRooms, getPublicRooms, getRoom } from '../api/roomApi';
import { roomKeys } from '../api/roomKeys';
import * as mutations from '../api/roomMutations';

export function usePublicRooms(propertyId: string | null) { return useQuery({ queryKey: roomKeys.publicList(propertyId ?? 'unconfigured'), queryFn: () => getPublicRooms(propertyId!), enabled: Boolean(propertyId) }); }
export function useOwnerRooms(propertyId: string | null) { return useQuery({ queryKey: roomKeys.ownerList(propertyId ?? 'unconfigured'), queryFn: () => getOwnerRooms(propertyId!), enabled: Boolean(propertyId) }); }
export function useRoom(propertyId: string | null, roomId: string, scope: 'public' | 'owner') { return useQuery({ queryKey: roomKeys.detail(propertyId ?? 'unconfigured', roomId, scope), queryFn: () => getRoom(propertyId!, roomId, scope), enabled: Boolean(propertyId && roomId) }); }
export function useRoomMutations(propertyId: string) { const client = useQueryClient(); const invalidate = async () => { await client.invalidateQueries({ queryKey: roomKeys.all }); };
  return {
    create: useMutation({ mutationFn: mutations.createRoom, onSuccess: invalidate }), update: useMutation({ mutationFn: mutations.updateRoom, onSuccess: invalidate }),
    publish: useMutation({ mutationFn: ({ room, value }: { room: Parameters<typeof mutations.setRoomPublished>[0]; value: boolean }) => mutations.setRoomPublished(room, value), onSuccess: invalidate }),
    status: useMutation({ mutationFn: ({ room, value }: { room: Parameters<typeof mutations.setRoomStatus>[0]; value: Parameters<typeof mutations.setRoomStatus>[1] }) => mutations.setRoomStatus(room, value), onSuccess: invalidate }),
    archive: useMutation({ mutationFn: ({ room, value }: { room: Parameters<typeof mutations.setRoomDeleted>[0]; value: boolean }) => mutations.setRoomDeleted(room, value), onSuccess: invalidate }), propertyId,
  };
}
