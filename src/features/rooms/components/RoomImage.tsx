import { Image } from 'expo-image';
import { BedDouble } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

export function RoomImage({ uri, label, style }: { uri?: string | undefined; label: string; style?: object | undefined }) {
  if (!uri) return <View accessibilityLabel={`${label}: foto belum tersedia`} style={[styles.placeholder, style]}><BedDouble color={colors.brand[600]} size={32} /><AppText variant="caption" tone="muted">Foto belum tersedia</AppText></View>;
  return <Image source={{ uri }} accessibilityLabel={label} alt={label} contentFit="cover" cachePolicy="memory-disk" transition={180} style={[styles.image, style]} />;
}
const styles = StyleSheet.create({ image: { width: '100%', aspectRatio: 4 / 3 }, placeholder: { width: '100%', aspectRatio: 4 / 3, backgroundColor: colors.brand[50], alignItems: 'center', justifyContent: 'center', gap: spacing[2] } });
