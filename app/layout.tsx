import type { Metadata } from 'next';
import { Open_Sans as OpenSansFont } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

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
      <body
        className={`${OpenSans.className} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
