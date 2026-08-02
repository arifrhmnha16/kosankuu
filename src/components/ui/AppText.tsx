import { forwardRef } from 'react';
import { StyleSheet, Text, type TextProps, type TextStyle } from 'react-native';

import { colors } from '@/design/colors';
import { typography, type TypographyVariant } from '@/design/typography';

export type AppTextTone = 'primary' | 'secondary' | 'muted' | 'brand' | 'danger' | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: TypographyVariant;
  tone?: AppTextTone;
  align?: TextStyle['textAlign'];
}

const tones: Record<AppTextTone, string> = { primary: colors.neutral[900], secondary: colors.neutral[600], muted: colors.neutral[500], brand: colors.brand[700], danger: colors.semantic.danger.foreground, inverse: colors.neutral[0] };

export const AppText = forwardRef<Text, AppTextProps>(function AppText({ variant = 'bodyMd', tone = 'primary', align, style, ...props }, ref) {
  return <Text ref={ref} allowFontScaling maxFontSizeMultiplier={1.3} style={[styles.base, typography[variant], { color: tones[tone], textAlign: align }, style]} {...props} />;
});

const styles = StyleSheet.create({ base: { includeFontPadding: false } });
