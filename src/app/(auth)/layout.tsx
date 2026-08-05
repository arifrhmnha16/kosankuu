import { PublicHeader } from "@/components/public-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <><PublicHeader />{children}</>;
}
