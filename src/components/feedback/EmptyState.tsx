import type { LucideIcon } from 'lucide-react-native';
import { Inbox } from 'lucide-react-native';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { Button } from '@/components/ui/Button';
import { AppText } from '@/components/ui/AppText';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

export interface EmptyStateProps extends ViewProps { title: string; description: string; actionLabel?: string; onAction?: () => void; icon?: LucideIcon; }

export function EmptyState({ title, description, actionLabel, onAction, icon: Icon = Inbox, style, ...props }: EmptyStateProps) {
  return <View accessibilityRole="summary" style={[styles.base, style]} {...props}><View style={styles.icon}><Icon color={colors.brand[600]} size={28} strokeWidth={1.8} /></View><AppText variant="titleMd" align="center">{title}</AppText><AppText tone="secondary" align="center">{description}</AppText>{actionLabel && onAction ? <Button label={actionLabel} variant="secondary" onPress={onAction} /> : null}</View>;
}

const styles = StyleSheet.create({ base: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: spacing[3], padding: spacing[6] }, icon: { width: 56, height: 56, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand[50] } });
