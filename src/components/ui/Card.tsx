import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { shadows } from '@/design/shadows';
import { spacing } from '@/design/spacing';

export interface CardProps extends ViewProps { elevated?: boolean; padding?: keyof typeof spacing; }

export function Card({ children, elevated = true, padding = 5, style, ...props }: PropsWithChildren<CardProps>) {
  return <View style={[styles.base, elevated && shadows.card, { padding: spacing[padding] }, style]} {...props}>{children}</View>;
}

const styles = StyleSheet.create({ base: { backgroundColor: colors.neutral[0], borderColor: colors.neutral[100], borderWidth: 1, borderRadius: radii.lg } });
