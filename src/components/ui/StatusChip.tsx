import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors, type SemanticColor } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

import { AppText } from './AppText';

export interface StatusChipProps extends ViewProps { label: string; tone?: SemanticColor; }

export function StatusChip({ label, tone = 'info', style, ...props }: StatusChipProps) {
  const palette = colors.semantic[tone];
  return <View accessibilityRole="text" accessibilityLabel={`Status: ${label}`} style={[styles.base, { backgroundColor: palette.background, borderColor: palette.border }, style]} {...props}><AppText variant="labelMd" style={{ color: palette.foreground }}>{label}</AppText></View>;
}

const styles = StyleSheet.create({ base: { alignSelf: 'flex-start', minHeight: 34, justifyContent: 'center', borderWidth: 1, borderRadius: radii.pill, paddingHorizontal: spacing[3] } });
