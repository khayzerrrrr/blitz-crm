'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, School, GitBranch, DollarSign, Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/schools', icon: School, label: 'Schools' },
  { href: '/visits/new', icon: Plus, label: 'Visit', highlight: true },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/revenue', icon: DollarSign, label: 'Revenue' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-3 left-3 right-3 z-50 safe-area-bottom">
      <div className="glass rounded-2xl shadow-lg border border-white/40 mx-auto max-w-lg">
        <div className="flex items-center justify-around h-16 px-1">
          {NAV.map(({ href, icon: Icon, label, highlight }) => {
            const active = pathname === href || (href !== '/visits/new' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 rounded-xl transition-all duration-200 min-w-[52px] py-1.5',
                  highlight
                    ? 'text-white bg-gradient-to-br from-brand-500 to-brand-600 -mt-7 size-12 rounded-full shadow-lg shadow-brand-500/25 flex items-center justify-center active:scale-95 transition-transform'
                    : active
                      ? 'text-brand-500'
                      : 'text-surface-400 hover:text-surface-600'
                )}
              >
                {highlight ? (
                  <Icon size={22} strokeWidth={2.5} />
                ) : (
                  <>
                    <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[9px] font-semibold">{label}</span>
                  </>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
