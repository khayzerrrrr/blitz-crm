'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, School, MapPin, GitBranch, BarChart3, Calendar, Search, Bell, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/schools', icon: School, label: 'Schools' },
  { href: '/visits', icon: MapPin, label: 'Visits' },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export default function TopNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-surface-200">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6 max-w-[1600px] mx-auto">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
            <Image src="/logo/blitz-logo-white.png" alt="BLITZ" width={28} height={28} className="h-7 w-7" />
            <div className="hidden sm:block">
              <span className="text-sm font-bold text-surface-900">BLITZ</span>
              <span className="text-[10px] text-brand-500 ml-1 font-semibold">CRM</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map(({ href, icon: Icon, label }) => {
              const active = pathname.startsWith(href);
              return (
                <Link key={href} href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    active ? 'bg-brand-50 text-brand-600' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button onClick={() => setShowSearch(!showSearch)}
            className="p-2.5 rounded-xl hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-all">
            <Search size={18} />
          </button>
          <button className="p-2.5 rounded-xl hover:bg-surface-100 text-surface-400 hover:text-surface-600 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-white" />
          </button>
          <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl text-sm font-semibold transition-all shadow-sm">
            <Plus size={16} />
            <span>New</span>
          </button>
          <div className="relative">
            <button onClick={() => setShowUser(!showUser)} className="flex items-center gap-2 p-1.5 pr-2 rounded-xl hover:bg-surface-100 transition-all">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-brand-500 text-white text-xs font-medium">
                  {session?.user?.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <ChevronDown size={14} className="text-surface-400 hidden sm:block" />
            </button>
            {showUser && (
              <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-dropdown border border-surface-200 p-1.5">
                <div className="px-3 py-2 border-b border-surface-100 mb-1">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-surface-400">{session?.user?.role}</p>
                </div>
                <Link href="/profile" className="block px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Profile</Link>
                <Link href="/settings" className="block px-3 py-2 text-sm text-surface-600 hover:bg-surface-50 rounded-lg">Settings</Link>
                <button onClick={() => signOut()} className="w-full text-left px-3 py-2 text-sm text-danger hover:bg-red-50 rounded-lg">Log out</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
