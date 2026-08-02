import { Link } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { EmptyState } from '@/components/feedback';
import { AppText, Card, Screen } from '@/components/ui';
import { colors } from '@/design/colors';
import { spacing } from '@/design/spacing';
export default function NotFound() { return <Screen scroll={false} contentStyle={styles.content}><Card><EmptyState title="Halaman tidak ditemukan" description="Alamat yang dibuka tidak tersedia." icon={SearchX} /></Card><Link href="/" accessibilityRole="link" style={styles.link}><AppText variant="labelLg" tone="brand">Kembali ke halaman publik</AppText></Link></Screen>; }
const styles = StyleSheet.create({ content: { justifyContent: 'center', alignItems: 'center' }, link: { minHeight: 44, padding: spacing[3], color: colors.brand[700] } });
