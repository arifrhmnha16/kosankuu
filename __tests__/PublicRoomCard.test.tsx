import { render } from '@testing-library/react-native';
import { PublicRoomCard } from '@/features/rooms/components/PublicRoomCard';
import type { RoomDocument } from '@/features/rooms/types';

jest.mock('expo-router', () => {
  const { Text } = jest.requireActual('react-native') as typeof import('react-native');
  return { Link: ({ children }: { children: React.ReactNode }) => <Text>{children}</Text> };
});
jest.mock('expo-image', () => ({ Image: () => null }));

test('public room card renders real room data without ratings', () => {
  const room = { id: 'room-1', propertyId: 'manzsa-residence', code: 'A01', name: 'Kamar A01', status: 'available', monthlyPrice: 1000000, capacity: 1, facilities: ['Wi-Fi', 'AC'], description: 'Kamar nyaman', imageUrls: [], imageStoragePaths: [], isPublished: true, isDeleted: false } as unknown as RoomDocument;
  const view = render(<PublicRoomCard room={room} />);
  expect(view.getAllByText('Kamar A01')).toHaveLength(2);
  expect(view.getByText('Lihat detail')).toBeOnTheScreen();
  expect(view.queryByText(/rating|ulasan/i)).toBeNull();
});
