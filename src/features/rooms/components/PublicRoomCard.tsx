import { Link, type Href } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { AppText, Card, StatusChip } from '@/components/ui';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';
import { formatCurrency } from '@/utils/format';
import type { RoomDocument } from '../types';
import { roomStatusLabels, roomStatusTones } from '../utils/status';
import { RoomImage } from './RoomImage';

export function PublicRoomCard({ room }: { room: RoomDocument }) {
  return <Card padding={0} style={styles.card}><View style={styles.imageWrap}><RoomImage uri={room.coverImageUrl} label={`Foto ${room.name}`} /><View style={styles.status}><StatusChip label={roomStatusLabels[room.status]} tone={roomStatusTones[room.status]} /></View></View><View style={styles.body}><AppText variant="caption" tone="brand">Kamar {room.code}</AppText><AppText variant="titleMd">{room.name}</AppText><AppText variant="moneyMd">{formatCurrency(room.monthlyPrice)}<AppText variant="caption" tone="muted">/bulan</AppText></AppText><View style={styles.facilities}>{room.facilities.slice(0, 3).map((facility) => <AppText key={facility} variant="caption" tone="secondary">• {facility}</AppText>)}</View><Link href={`/rooms/${room.id}` as Href} accessibilityRole="link" style={styles.link}>Lihat detail</Link></View></Card>;
}
const styles = StyleSheet.create({ card: { overflow: 'hidden', flex: 1 }, imageWrap: { position: 'relative' }, status: { position: 'absolute', left: spacing[3], top: spacing[3] }, body: { padding: spacing[4], gap: spacing[2] }, facilities: { minHeight: 24, flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }, link: { minHeight: 44, paddingVertical: spacing[3], color: colors.brand[700], fontWeight: '700', borderRadius: radii.sm } });
