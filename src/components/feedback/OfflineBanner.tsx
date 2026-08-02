import { WifiOff } from 'lucide-react-native';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

export interface OfflineBannerProps extends ViewProps { visible?: boolean; message?: string; }

export function OfflineBanner({ visible = true, message = 'Sedang offline. Data terbaru akan dimuat saat koneksi kembali.', style, ...props }: OfflineBannerProps) {
  if (!visible) return null;
  return <View accessibilityRole="alert" style={[styles.base, style]} {...props}><WifiOff color={colors.semantic.warning.foreground} size={18} /><AppText variant="caption" style={styles.text}>{message}</AppText></View>;
}

const styles = StyleSheet.create({ base: { flexDirection: 'row', alignItems: 'center', gap: spacing[2], borderWidth: 1, borderColor: colors.semantic.warning.border, backgroundColor: colors.semantic.warning.background, borderRadius: radii.sm, paddingHorizontal: spacing[3], paddingVertical: spacing[2] }, text: { flex: 1, color: colors.semantic.warning.foreground } });
