'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, School, MapPin, GitBranch, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { href: '/schools', icon: School, label: 'Schools' },
  { href: '/visits/new', icon: Plus, label: 'New', highlight: true },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-surface-200 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {NAV.map(({ href, icon: Icon, label, highlight }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[56px]',
                highlight
                  ? 'text-white bg-brand-500 -mt-4 w-12 h-12 rounded-full shadow-lg'
                  : active
                    ? 'text-brand-500'
                    : 'text-surface-400 hover:text-surface-600'
              )}
            >
              <Icon size={highlight ? 20 : 18} />
              {!highlight && <span className="text-[9px] font-medium">{label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
