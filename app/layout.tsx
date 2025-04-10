import type { Metadata } from 'next';
import { Open_Sans as OpenSansFont } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import Script from 'next/script'; // ✅ Required for loading GA scripts

const OpenSans = OpenSansFont({
  weight: ['400', '600'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Accountant | Smart Financial Solutions for Individuals & Businesses',
  description:
    'Professional accounting services tailored for individuals, startups, and enterprises. Manage your finances, taxes, payroll, and reporting with confidence and clarity.',
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
        {/* ✅ Google Analytics script loader */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-V9DBVLDQM5"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-V9DBVLDQM5', {
                page_path: window.location.pathname,
              });
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
