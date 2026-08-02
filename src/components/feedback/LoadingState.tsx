import { ActivityIndicator, StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { AppText } from '@/components/ui/AppText';

export interface LoadingStateProps extends ViewProps { label?: string; }

export function LoadingState({ label = 'Menyiapkan halaman…', style, ...props }: LoadingStateProps) {
  return <View accessibilityRole="progressbar" accessibilityLabel={label} style={[styles.base, style]} {...props}><ActivityIndicator size="large" color={colors.brand[500]} /><AppText tone="secondary">{label}</AppText></View>;
}

const styles = StyleSheet.create({ base: { flex: 1, minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: spacing[3] } });
