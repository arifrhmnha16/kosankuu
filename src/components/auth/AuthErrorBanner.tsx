import { AlertCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { AppText } from '@/components/ui';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

export function AuthErrorBanner({ message }: { message: string }) {
  return <View accessibilityRole="alert" style={styles.base}><AlertCircle color={colors.semantic.danger.foreground} size={20} /><AppText variant="bodySm" style={styles.text}>{message}</AppText></View>;
}
const styles = StyleSheet.create({ base: { flexDirection: 'row', gap: spacing[2], padding: spacing[3], borderRadius: radii.sm, borderWidth: 1, borderColor: colors.semantic.danger.border, backgroundColor: colors.semantic.danger.background }, text: { flex: 1, color: colors.semantic.danger.foreground } });
