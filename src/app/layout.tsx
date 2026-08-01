import type { Metadata } from "next";
import { Press_Start_2P, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import DiscordFloatingButton from "@/components/DiscordFloatingButton";
import VisitTracker from "@/components/VisitTracker";
import { getSiteSettings } from "@/lib/settings";

export const runtime = "edge";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const body = Sora({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BanglaYX CORE — The Ultimate Bangladeshi Minecraft Survival Experience",
  description:
    "BanglaYX CORE is a premium Bangladeshi Minecraft survival server with economy, land claims, jobs, crates, and a friendly lag-free community. Join at play.banglayxcore.fun.",
  keywords: [
    "BanglaYX CORE",
    "Bangladeshi Minecraft server",
    "Minecraft survival server",
    "play.banglayxcore.fun",
  ],
  openGraph: {
    title: "BanglaYX CORE",
    description: "The Ultimate Bangladeshi Minecraft Survival Experience",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className="dark">
      <body
        className={`${pixel.variable} ${display.variable} ${body.variable} ${mono.variable} font-body bg-void text-ink antialiased custom-cursor-active`}
      >
        <CustomCursor />
        <VisitTracker />
        <Navbar settings={settings} />
        <main className="min-h-screen">{children}</main>
        <Footer settings={settings} />
        <DiscordFloatingButton discordInvite={settings.discord_invite} />
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#151b14",
              border: "1px solid #243024",
              color: "#e9f2e6",
            },
          }}
        />
      </body>
    </html>
  );
}
