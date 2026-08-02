import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type PressableProps, type ViewStyle } from 'react-native';

import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

import { AppText, type AppTextTone } from './AppText';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive';
export interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: ButtonVariant;
  loading?: boolean;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variants: Record<ButtonVariant, { background: string; border: string; pressed: string; tone: AppTextTone; spinner: string }> = {
  primary: { background: colors.brand[500], border: colors.brand[500], pressed: colors.brand[600], tone: 'inverse', spinner: colors.neutral[0] },
  secondary: { background: colors.brand[50], border: colors.brand[200], pressed: colors.brand[100], tone: 'brand', spinner: colors.brand[700] },
  outline: { background: colors.neutral[0], border: colors.neutral[200], pressed: colors.neutral[50], tone: 'primary', spinner: colors.neutral[700] },
  destructive: { background: colors.semantic.danger.foreground, border: colors.semantic.danger.foreground, pressed: '#9D2C25', tone: 'inverse', spinner: colors.neutral[0] },
};

export function Button({ label, variant = 'primary', loading = false, disabled = false, leftIcon, fullWidth = false, accessibilityLabel, style, onFocus, onBlur, ...props }: ButtonProps) {
  const palette = variants[variant];
  const unavailable = disabled || loading;
  const [focused, setFocused] = useState(false);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: unavailable, busy: loading }}
      disabled={unavailable}
      onFocus={(event) => { setFocused(true); onFocus?.(event); }}
      onBlur={(event) => { setFocused(false); onBlur?.(event); }}
      style={({ pressed, hovered }) => [styles.base, fullWidth && styles.fullWidth, { backgroundColor: pressed || hovered ? palette.pressed : palette.background, borderColor: focused ? colors.brand[500] : palette.border, opacity: unavailable ? 0.55 : 1 }, focused && styles.focused, style]}
      {...props}
    >
      {loading ? <ActivityIndicator color={palette.spinner} /> : <View style={styles.content}>{leftIcon}<AppText variant="labelLg" tone={palette.tone}>{label}</AppText></View>}
    </Pressable>
  );
}

const styles = StyleSheet.create({ base: { minHeight: 52, minWidth: 52, borderRadius: radii.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing[5] }, fullWidth: { alignSelf: 'stretch' }, focused: { borderWidth: 2 }, content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing[2] } });
