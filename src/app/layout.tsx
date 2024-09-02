import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

const wantedSans = localFont({
  src: '../../public/fonts/WantedSansVariable.woff2',
  fallback: [
    'Wanted Sans',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
  variable: '--font-sans',
  display: 'optional',
  preload: true,
});

export const metadata: Metadata = {
  title: '✦☁️',
  description: 'shine; consolingly but extraordinarily',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
    title: '✦☁️',
    description: 'shine; consolingly but extraordinarily',
    siteName: '✦☁️',
  },
  twitter: {
    card: 'summary_large_image',
    site: 'https://blog.hareen.io',
    creator: '@_hareeen',
    title: '✦☁️',
    description: 'shine; consolingly but extraordinarily',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="ko">
      <body className={cn('min-h-screen bg-background font-sans antialiased', wantedSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
