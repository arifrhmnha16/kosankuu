import { Clock3, ShieldAlert, UserX } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Card, Screen, StatusChip } from '@/components/ui';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';
import { useAuth } from '@/hooks/useAuth';

const copy = {
  'missing-profile': { title: 'Profil akun belum tersedia', description: 'Akun berhasil masuk, tetapi profil users/{uid} belum dibuat. Hubungi owner.', icon: UserX, tone: 'warning' as const },
  inactive: { title: 'Akun dinonaktifkan', description: 'Akun ini tidak dapat mengakses aplikasi. Hubungi owner bila status ini tidak sesuai.', icon: ShieldAlert, tone: 'danger' as const },
  pending: { title: 'Akun menunggu aktivasi', description: 'Profil sudah tersedia, tetapi status akun masih pending.', icon: Clock3, tone: 'pending' as const },
  'invalid-role': { title: 'Profil akun tidak valid', description: 'Role atau data akses akun tidak dikenali. Hubungi owner untuk memperbaiki profil.', icon: ShieldAlert, tone: 'danger' as const },
  error: { title: 'Profil belum dapat diperiksa', description: 'Periksa koneksi, lalu muat ulang profil atau keluar dari akun.', icon: ShieldAlert, tone: 'danger' as const },
};

export default function AccountStatus() {
  const { authState, firebaseUser, error, refreshProfile, signOut, isLoading } = useAuth();
  const state = copy[authState as keyof typeof copy] ?? copy.error;
  const Icon = state.icon;
  return <Screen scroll={false} contentStyle={styles.screen}><Card style={styles.card}><View style={styles.icon}><Icon size={30} color={colors.semantic[state.tone].foreground} /></View><StatusChip label="Akses dibatasi" tone={state.tone} /><AppText variant="titleXl" align="center">{state.title}</AppText><AppText tone="secondary" align="center">{error ?? state.description}</AppText>{firebaseUser?.email ? <AppText variant="caption" tone="muted" align="center">{firebaseUser.email}</AppText> : null}<View style={styles.actions}>{authState === 'error' ? <Button label="Muat ulang profil" variant="secondary" loading={isLoading} onPress={() => void refreshProfile()} fullWidth /> : null}<Button label="Keluar" variant="outline" onPress={() => void signOut()} fullWidth /></View></Card></Screen>;
}
const styles = StyleSheet.create({ screen: { justifyContent: 'center' }, card: { width: '100%', maxWidth: 480, alignSelf: 'center', alignItems: 'center', gap: spacing[4] }, icon: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center' }, actions: { width: '100%', gap: spacing[3], marginTop: spacing[2] } });
