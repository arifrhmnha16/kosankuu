import { KeyRound } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { EmptyState } from '@/components/feedback';
import { AppText, Button, Card, Screen, StatusChip } from '@/components/ui';
import { spacing } from '@/design/spacing';
import { useAuth } from '@/hooks/useAuth';

export default function TenantHome() {
  const { profile, firebaseUser, signOut } = useAuth();
  return <Screen><View style={styles.header}><StatusChip label="Tenant aktif" tone="success" /><AppText variant="titleXl">Halo, {profile?.displayName}</AppText><AppText tone="secondary">{firebaseUser?.email}</AppText></View><Card elevated={false}><EmptyState title="Data tenant belum tersedia" description="Foundation authentication sudah aktif. Data sewa dan tagihan baru akan dikerjakan pada milestone yang sesuai." icon={KeyRound} /></Card><Button label="Keluar" variant="outline" onPress={() => void signOut()} /></Screen>;
}
const styles = StyleSheet.create({ header: { gap: spacing[3] } });
