import { LayoutDashboard } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/feedback';
import { AppText, Button, Card, Screen, StatusChip } from '@/components/ui';
import { spacing } from '@/design/spacing';
import { useAuth } from '@/hooks/useAuth';

export default function OwnerDashboard() {
  const { profile, firebaseUser, signOut } = useAuth();
  return <Screen><View style={styles.header}><StatusChip label="Owner aktif" tone="success" /><AppText variant="titleXl">Halo, {profile?.displayName}</AppText><AppText tone="secondary">{firebaseUser?.email}</AppText></View><Card elevated={false}><EmptyState title="Data operasional belum tersedia" description="Authentication dan role protection sudah aktif. Fitur bisnis belum dikerjakan pada milestone ini." icon={LayoutDashboard} /></Card><Button label="Keluar" variant="outline" onPress={() => void signOut()} /></Screen>;
}
const styles = StyleSheet.create({ header: { gap: spacing[3] } });
