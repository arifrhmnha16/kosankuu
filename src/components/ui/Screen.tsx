import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';

export interface ScreenProps extends PropsWithChildren { scroll?: boolean; contentStyle?: ViewStyle; scrollProps?: Omit<ScrollViewProps, 'contentContainerStyle'>; }

export function Screen({ children, scroll = true, contentStyle, scrollProps }: ScreenProps) {
  const content = scroll ? <ScrollView contentContainerStyle={[styles.content, contentStyle]} keyboardShouldPersistTaps="handled" {...scrollProps}>{children}</ScrollView> : <View style={[styles.content, styles.fill, contentStyle]}>{children}</View>;
  return <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: colors.neutral[25] }, fill: { flex: 1 }, content: { width: '100%', maxWidth: 960, alignSelf: 'center', paddingHorizontal: spacing[5], paddingVertical: spacing[6], gap: spacing[6] } });
