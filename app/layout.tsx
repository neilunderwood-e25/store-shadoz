import type { Metadata } from "next";
import { Anta, Archivo, JetBrains_Mono } from "next/font/google";
import { Footer } from "@/components/footer/footer";
import { Header } from "@/components/header/header";
import "./globals.css";

const anta = Anta({
  variable: "--font-anta",
  weight: "400",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

// Applies the saved theme (or the device setting) before the first paint, so there is no flash.
const themeScript = `(function(){var t=null;try{t=localStorage.getItem('sz:theme')}catch(e){}if(t!=='light'&&t!=='dark'){try{t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}catch(e){t='dark'}}document.documentElement.setAttribute('data-theme',t)})();`;

export const metadata: Metadata = {
  title: {
    default: "Shadoz",
    template: "%s — Shadoz",
  },
  description: "Elevated basics, cut and sewn in Sri Lanka.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The theme script sets data-theme before React hydrates.
      suppressHydrationWarning
      className={`${anta.variable} ${archivo.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
