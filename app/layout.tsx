import type { Metadata } from 'next';
import { Open_Sans as OpenSansFont } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Script from 'next/script'; // ✅ Import Script component

const OpenSans = OpenSansFont({
  weight: ['400', '600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Accountant | Smart Financial Solutions for Individuals & Businesses',
  description: 'Professional accounting services tailored for individuals, startups, and enterprises. Manage your finances, taxes, payroll, and reporting with confidence and clarity.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
      </head>
      <body className={`${OpenSans.className} antialiased`}>
        {/* ✅ Plausible script included here using <Script /> */}
        <Script
          strategy="afterInteractive"
          data-domain="accountant2.onrender.com"
          src="https://plausible.io/js/script.outbound-links.js"
        />
        <Script
          id="plausible-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.plausible = window.plausible || function () {
                (window.plausible.q = window.plausible.q || []).push(arguments)
              };
            `,
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
