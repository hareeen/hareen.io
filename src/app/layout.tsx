import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';
import Head from 'next/head';

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
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css"
          integrity="sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww"
        />
      </Head>
      <body className={cn('min-h-screen bg-background font-sans antialiased', wantedSans.variable)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
