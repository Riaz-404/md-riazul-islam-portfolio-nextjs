import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Toaster } from "sonner";
import { generateMetadata as generateDynamicMetadata } from "@/lib/metadata-service";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export async function generateMetadata(): Promise<Metadata> {
  return await generateDynamicMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <main className="grow min-h-screen max-w-screen overflow-x-hidden">
            {children}
          </main>
          <ScrollToTop />
          <Toaster position="top-right" richColors expand theme="system" />
        </ThemeProvider>
      </body>
    </html>
  );
}
