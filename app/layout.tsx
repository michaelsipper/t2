import { FooterNav } from '@/components/layout/footer-nav';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { AppProvider } from "@/components/shared/AppContext";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <base target="_self" /> {/* Ensures links open in the same app context */}
        
        {/* JavaScript to intercept navigation and keep it in-app for iOS */}
        <script dangerouslySetInnerHTML={{
          __html: `
            if (window.navigator.standalone) {
              document.addEventListener('click', function(event) {
                let target = event.target as HTMLElement;
                while (target && target.nodeName !== 'A') target = target.parentNode as HTMLElement;
                if (target && target.nodeName === 'A' && target.getAttribute('href')) {
                  event.preventDefault();
                  window.location.href = target.getAttribute('href');
                }
              });
            }
          `,
        }} />
      </head>
      <body className={`${inter.className} flex flex-col`} style={{ height: '100vh', minHeight: '-webkit-fill-available' }}>
        <AppProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={true}
            disableTransitionOnChange
          >
            <div className="flex flex-col" style={{ height: '100vh' }}>
              <main className="flex-1 pb-16">{children}</main>
              <FooterNav />
            </div>
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
