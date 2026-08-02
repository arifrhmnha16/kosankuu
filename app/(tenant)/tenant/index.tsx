import { KeyRound } from 'lucide-react-native';
import { FoundationPage } from '@/components/layout/FoundationPage';
export default function TenantHome() { return <FoundationPage eyebrow="Area tenant" title="Beranda Tenant" description="Route ini baru berupa fondasi visual dan belum dilindungi autentikasi." emptyTitle="Data tenant belum tersedia" emptyDescription="Sewa, tagihan, dan keluhan akan memakai data Firebase nyata setelah authentication dan role protection selesai." icon={KeyRound} />; }
