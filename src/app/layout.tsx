import type { Metadata } from 'next';
import { TooltipProvider } from '@/components/ui/tooltip';
import '@/styles/global.css';

export const metadata: Metadata = {
  title: 'BLITZ CRM',
  description: 'Field Sales CRM for Blitz Bilingual Education',
  icons: { icon: '/logo/blitz-logo-white.png' },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-surface-50 text-surface-900 antialiased font-sans">
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
