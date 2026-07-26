'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, School, ClipboardCheck, GitFork, Users, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['SUPER_ADMIN', 'OWNER', 'MANAGEMENT', 'REGIONAL', 'SALES'] },
  { href: '/schools', icon: School, label: 'Sekolah', roles: ['SUPER_ADMIN', 'OWNER', 'MANAGEMENT', 'REGIONAL', 'SALES'] },
  { href: '/visits', icon: ClipboardCheck, label: 'Kunjungan', roles: ['SUPER_ADMIN', 'MANAGEMENT', 'REGIONAL', 'SALES'] },
  { href: '/pipeline', icon: GitFork, label: 'Pipeline', roles: ['SUPER_ADMIN', 'OWNER', 'MANAGEMENT', 'REGIONAL', 'SALES'] },
  { href: '/users', icon: Users, label: 'Users', roles: ['SUPER_ADMIN'] },
  { href: '/settings', icon: Settings, label: 'Settings', roles: ['SUPER_ADMIN'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const role = session?.user?.role || 'SALES';

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className={cn(
      'h-screen bg-slate-900 text-white flex flex-col transition-all duration-200 shrink-0',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Brand */}
      <div className="flex items-center h-14 px-3 border-b border-white/10">
        {collapsed ? (
          <Image src="/logo/blitz-logo-white.png" alt="B" width={28} height={28} className="mx-auto" />
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <Image src="/logo/blitz-logo-white.png" alt="BLITZ" width={28} height={28} />
            <div>
              <div className="text-sm font-bold leading-tight">BLITZ CRM</div>
              <div className="text-[10px] text-orange-300 leading-tight">Field Sales</div>
            </div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-white/10 rounded ml-auto">
          <ChevronLeft size={16} className={cn('transition-transform', collapsed && 'rotate-180')} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 space-y-0.5">
        {filteredNav.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href}
            className={cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition',
              pathname.startsWith(href) ? 'bg-orange-500/20 text-orange-400' : 'text-slate-300 hover:bg-white/5',
              collapsed && 'justify-center px-2'
            )}
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        {collapsed ? (
          <Avatar className="w-8 h-8 mx-auto">
            <AvatarFallback className="bg-orange-500 text-white text-xs">{session?.user?.name?.[0] || 'U'}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-orange-500 text-white text-xs">{session?.user?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{session?.user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{session?.user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="w-6 h-6 text-slate-400 hover:text-white" onClick={() => signOut()}>
              <LogOut size={14} />
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
