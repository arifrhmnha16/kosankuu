import { AlertCircle } from 'lucide-react-native';
import { StyleSheet, View, type ViewProps } from 'react-native';

import { AppText } from '@/components/ui/AppText';
import { Button } from '@/components/ui/Button';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';

export interface ErrorStateProps extends ViewProps { title?: string; description: string; retryLabel?: string; onRetry?: () => void; }

export function ErrorState({ title = 'Data belum dapat dimuat', description, retryLabel = 'Coba lagi', onRetry, style, ...props }: ErrorStateProps) {
  return <View accessibilityRole="alert" style={[styles.base, style]} {...props}><View style={styles.icon}><AlertCircle color={colors.semantic.danger.foreground} size={28} /></View><AppText variant="titleMd" align="center">{title}</AppText><AppText tone="secondary" align="center">{description}</AppText>{onRetry ? <Button label={retryLabel} variant="outline" onPress={onRetry} /> : null}</View>;
}

const styles = StyleSheet.create({ base: { minHeight: 240, alignItems: 'center', justifyContent: 'center', gap: spacing[3], padding: spacing[6] }, icon: { width: 56, height: 56, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.semantic.danger.background } });
