import { LogIn } from 'lucide-react-native';
import { FoundationPage } from '@/components/layout/FoundationPage';
export default function Login() { return <FoundationPage eyebrow="Akses akun" title="Masuk ke Manzsa Residence" description="Autentikasi belum diaktifkan pada tahap Foundation." emptyTitle="Login tersedia di Milestone 2" emptyDescription="Tidak ada akun atau role dummy. Firebase Authentication akan dikonfigurasi setelah Foundation disetujui." icon={LogIn} />; }
