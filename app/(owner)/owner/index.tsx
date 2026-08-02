import { LayoutDashboard } from 'lucide-react-native';
import { FoundationPage } from '@/components/layout/FoundationPage';
export default function OwnerDashboard() { return <FoundationPage eyebrow="Area owner" title="Dashboard Owner" description="Route ini baru berupa fondasi visual dan belum memiliki role guard." emptyTitle="Data operasional belum tersedia" emptyDescription="Kamar, penghuni, dan transaksi akan berasal dari Firestore pada milestone yang sesuai, tanpa mock permanen." icon={LayoutDashboard} />; }
