import type { Metadata } from "next";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/600.css";
import "@fontsource/cormorant-garamond/700.css";
import "lenis/dist/lenis.css";
import "./globals.css";
import { env } from "@/lib/env";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata:Metadata={metadataBase:new URL(env.NEXT_PUBLIC_APP_URL),title:{default:"Manzsa Residence",template:"%s | Manzsa Residence"},description:"Hunian nyaman dengan booking dan pengelolaan sewa yang jelas.",alternates:{canonical:"/"},openGraph:{title:"Manzsa Residence",description:"Hunian nyaman, hangat, dan terkelola.",type:"website",locale:"id_ID"},twitter:{card:"summary_large_image"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="id" data-scroll-behavior="smooth"><body><SmoothScroll>{children}</SmoothScroll></body></html>}
