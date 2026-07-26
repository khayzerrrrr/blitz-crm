'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import {
  LayoutDashboard, School, MapPin, GitBranch, DollarSign,
  Users, ChevronLeft, ChevronRight, LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState, useEffect } from 'react';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/schools', icon: School, label: 'Schools' },
  { href: '/visits', icon: MapPin, label: 'Visits' },
  { href: '/pipeline', icon: GitBranch, label: 'Pipeline' },
  { href: '/revenue', icon: DollarSign, label: 'Revenue' },
  { href: '/users', icon: Users, label: 'Users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('sidebar-collapsed');
    if (stored !== null) setCollapsed(stored === 'true');
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, [collapsed, mounted]);

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col fixed left-0 top-0 h-full z-40 transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[240px]'
      )}
    >
      <div className="flex flex-col h-full glass-dark border-r border-white/8">
        {/* Logo */}
        <div className={cn(
          'flex items-center h-16 px-4 border-b border-white/8 shrink-0',
          collapsed ? 'justify-center' : 'gap-3'
        )}>
          <Image src="/logo/blitz-logo-white.png" alt="BLITZ" width={28} height={28} className="size-7 shrink-0" />
          {!collapsed && (
            <div className="overflow-hidden animate-slide-right">
              <span className="text-sm font-bold text-white tracking-tight">BLITZ</span>
              <span className="text-[10px] text-brand-400 ml-1 font-semibold tracking-wide">CRM</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {NAV_ITEMS.map(({ href, icon: Icon, label }, i) => {
            const active = pathname.startsWith(href);
            return (
              <Tooltip key={href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className={cn(
                      'flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden',
                      collapsed ? 'justify-center h-10 w-full' : 'gap-3 px-3 py-2.5',
                      active
                        ? 'bg-brand-500/15 text-brand-400 shadow-glow-brand'
                        : 'text-surface-400 hover:text-white hover:bg-white/5'
                    )}
                    style={{ animationDelay: mounted ? `${i * 0.05}s` : '0s' }}
                  >
                    {active && !collapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-brand-500 rounded-r-full" />
                    )}
                    <Icon size={20} strokeWidth={active ? 2.5 : 1.8} className={cn('shrink-0 transition-transform duration-200', active && 'scale-110')} />
                    {!collapsed && (
                      <span className={cn(
                        'text-sm font-medium truncate',
                        active ? 'font-semibold' : 'font-normal'
                      )}>
                        {label}
                      </span>
                    )}
                    {active && collapsed && (
                      <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-l-full" />
                    )}
                  </Link>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="ml-2">{label}</TooltipContent>}
              </Tooltip>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <div className="px-3 pb-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center h-9 rounded-xl text-surface-400 hover:text-white hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User */}
        <div className={cn(
          'border-t border-white/8 p-3',
          collapsed ? 'flex justify-center' : 'px-3'
        )}>
          {collapsed ? (
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <div className="size-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                  {session?.user?.name?.[0] || 'U'}
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2">
                <p className="text-xs font-semibold">{session?.user?.name}</p>
                <p className="text-[10px] text-surface-400">{session?.user?.role}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-xl bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {session?.user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{session?.user?.name}</p>
                <p className="text-[10px] text-surface-400">{session?.user?.role}</p>
              </div>
              <button
                onClick={() => document.dispatchEvent(new CustomEvent('signout'))}
                className="p-1.5 rounded-lg text-surface-400 hover:text-danger-400 hover:bg-danger-400/10 transition-all"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
