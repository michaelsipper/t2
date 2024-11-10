import { FooterNav } from '@/components/layout/footer-nav';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Tap'dIn",
  description: 'Social Planning App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pb-16">{children}</main>
          <FooterNav />
        </div>
      </body>
    </html>
  );
}