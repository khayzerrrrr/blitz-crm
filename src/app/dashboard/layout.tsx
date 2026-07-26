'use client';

import { SessionProvider } from 'next-auth/react';
import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileNav from '@/components/layout/MobileNav';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) setSidebarCollapsed(stored === 'true');

    const handleStorage = () => {
      const s = localStorage.getItem('sidebar-collapsed');
      setSidebarCollapsed(s === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <SessionProvider>
      <div className="min-h-screen bg-surface-50">
        <Sidebar />
        <div
          className="transition-all duration-300 ease-in-out lg:ml-[240px]"
          style={{ marginLeft: 'var(--sidebar-width, 240px)' }}
        >
          <TopNav />
          <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 pb-28 lg:pb-6">
            {children}
          </main>
        </div>
        <MobileNav />
      </div>

      <style jsx global>{`
        :root {
          --sidebar-width: ${sidebarCollapsed ? '72px' : '240px'};
        }
        @media (max-width: 1023px) {
          :root {
            --sidebar-width: 0px;
          }
        }
      `}</style>
    </SessionProvider>
  );
}
