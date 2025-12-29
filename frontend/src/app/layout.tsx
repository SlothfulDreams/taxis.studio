import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

// Premium display font - clean, geometric, modern
const satoshi = localFont({
  src: [
    {
      path: "../fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Satoshi-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

// Refined body font - slightly humanist, excellent readability
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

// Monospace for code/technical elements
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Interior AI - AI-Powered Interior Design Editor",
  description: "Transform your interior spaces with AI-powered design tools",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable} ${jakarta.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ConvexClientProvider>
          <AuthProvider>
            {children}
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
