import type { LucideIcon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { EmptyState, OfflineBanner } from '@/components/feedback';
import { AppText, Card, Screen, StatusChip } from '@/components/ui';
import { spacing } from '@/design/spacing';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

export interface FoundationPageProps { eyebrow: string; title: string; description: string; emptyTitle: string; emptyDescription: string; icon: LucideIcon; }

export function FoundationPage({ eyebrow, title, description, emptyTitle, emptyDescription, icon }: FoundationPageProps) {
  const { isOffline } = useNetworkStatus();
  return <Screen><OfflineBanner visible={isOffline} /><View style={styles.header}><StatusChip label={eyebrow} /><AppText variant="titleXl">{title}</AppText><AppText variant="bodyLg" tone="secondary">{description}</AppText></View><Card elevated={false}><EmptyState title={emptyTitle} description={emptyDescription} icon={icon} /></Card><AppText variant="caption" tone="muted" align="center">Foundation • Android dan web</AppText></Screen>;
}

const styles = StyleSheet.create({ header: { gap: spacing[3] }, });
