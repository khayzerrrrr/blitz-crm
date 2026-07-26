'use client';

import { SessionProvider } from 'next-auth/react';
import TopNav from '@/components/layout/TopNav';
import MobileNav from '@/components/layout/MobileNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-surface-50">
        <TopNav />
        <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 pb-24 lg:pb-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </SessionProvider>
  );
}
