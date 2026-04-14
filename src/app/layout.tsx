import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Toaster } from "sonner";
import { generateMetadata as generateDynamicMetadata } from "@/lib/metadata-service";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Kept for admin panel compatibility
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
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
      <head>
        {/* Font Awesome — kept for admin panel icon compatibility */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
        {/* Themify Icons — kept for admin panel icon compatibility */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/themify-icons@0.1.2/css/themify-icons.css"
        />
      </head>
      <body
        className={`${inter.variable} ${poppins.variable} antialiased overflow-x-hidden`}
        style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
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
