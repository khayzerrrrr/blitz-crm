'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Search, Bell, Plus, Menu, LogOut, User, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function TopNav() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    const handler = () => signOut();
    document.addEventListener('signout', handler);
    return () => document.removeEventListener('signout', handler);
  }, []);

  const initials = session?.user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <header
      className={cn(
        'sticky top-0 z-30 transition-all duration-300',
        scrolled
          ? 'glass shadow-sm border-b border-surface-200/50'
          : 'bg-transparent border-b border-transparent'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left: Mobile menu trigger */}
        <button
          className="lg:hidden p-2 -ml-2 rounded-xl text-surface-600 hover:bg-surface-100 transition-all"
          onClick={() => document.dispatchEvent(new CustomEvent('toggle-mobile-sidebar'))}
        >
          <Menu size={20} />
        </button>

        {/* Page title placeholder - could be dynamic */}
        <div className="hidden lg:block" />

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all hidden sm:block">
            <Search size={18} />
          </button>

          {/* Notifications */}
          <button className="p-2.5 rounded-xl text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          </button>

          {/* New Visit CTA */}
          <Button size="sm" className="hidden sm:flex items-center gap-1.5 shadow-sm" asChild>
            <Link href="/visits/new">
              <Plus size={16} strokeWidth={2.5} />
              <span>New Visit</span>
            </Link>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-100 transition-all ml-1">
                <div className="size-8 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                  {initials}
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">{session?.user?.name}</span>
                  <span className="text-xs text-surface-400 font-normal">{session?.user?.role}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User size={14} className="mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={14} className="mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-danger-500 focus:text-danger-500"
                onClick={() => signOut()}
              >
                <LogOut size={14} className="mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
