import { Building2 } from 'lucide-react-native';
import { FoundationPage } from '@/components/layout/FoundationPage';
export default function PublicHome() { return <FoundationPage eyebrow="Halaman publik" title="Manzsa Residence" description="Informasi satu properti kos akan ditampilkan di sini setelah Firebase dikonfigurasi." emptyTitle="Profil kos belum tersedia" emptyDescription="Foundation sudah siap. Konten properti dan kamar akan dihubungkan ke Firestore pada milestone berikutnya." icon={Building2} />; }
