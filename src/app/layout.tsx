import type { Metadata } from "next";
import { Work_Sans, Roboto, Poppins } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/shared/theme-provider";
import { ScrollToTop } from "@/components/shared/scroll-to-top";
import { Toaster } from "sonner";
import { generateMetadata as generateDynamicMetadata } from "@/lib/metadata-service";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
        />
        {/* Themify Icons */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/themify-icons@0.1.2/css/themify-icons.css"
        />
      </head>
      <body
        className={`${workSans.variable} ${roboto.variable} ${poppins.variable} font-roboto antialiased overflow-x-hidden`}
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
