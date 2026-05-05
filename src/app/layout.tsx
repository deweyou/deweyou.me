import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';
import { ThemeProvider } from '##/components/theme-provider';
import '@deweyou-design/styles/theme.css';
import './globals.css';
import '##/styles/site.css';

const sourceHanSerif = localFont({
  src: [
    { path: './fonts/SourceHanSerifCN-Regular.otf',  weight: '400', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-Medium.otf',   weight: '500', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-SemiBold.otf', weight: '600', style: 'normal' },
    { path: './fonts/SourceHanSerifCN-Bold.otf',     weight: '700', style: 'normal' },
  ],
  variable: '--font-source-han-serif',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Dewey Ou',
  description: '前端工程师，住在深圳。做有意思的产品，过有意思的生活。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${sourceHanSerif.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevent FOUC: set data-theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);return;}if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/dist/tabler-icons.min.css"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
