'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Shield, User, MapPin } from 'lucide-react';

interface UserItem {
  id: string; name: string; email: string;
  role: { name: string };
  island?: { name: string } | null;
}

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  OWNER: 'Owner',
  MANAGEMENT: 'Management',
  REGIONAL: 'Regional',
  SALES: 'Sales',
};

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-violet-50 text-violet-700 border-violet-200',
  OWNER: 'bg-navy-50 text-navy-700 border-navy-200',
  MANAGEMENT: 'bg-accent-50 text-accent-700 border-accent-200',
  REGIONAL: 'bg-brand-50 text-brand-700 border-brand-200',
  SALES: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/users');
        const json = await res.json();
        setUsers(json.data || json || []);
      } catch {} finally { setLoading(false); }
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-surface-900 tracking-tight">Users</h1>
          <p className="text-sm text-surface-400 mt-0.5">Manage team members</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-brand-500/20">
              <Plus size={16} strokeWidth={2.5} />Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="text-center py-8">
              <div className="size-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                <User size={28} className="text-surface-400" />
              </div>
              <p className="text-sm text-surface-400">User creation form will be available soon.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users List */}
      <div className="glass-card rounded-2xl overflow-hidden animate-slide-up">
        <div className="p-5 border-b border-surface-100/80">
          <h2 className="text-base font-bold text-surface-900">Team Members</h2>
          <p className="text-xs text-surface-400 mt-0.5">{users.length} total users</p>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-14">
            <div className="size-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-surface-300" />
            </div>
            <p className="text-base font-semibold text-surface-400">No users yet</p>
            <p className="text-xs text-surface-300 mt-1">User data will appear after database is connected</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-50">
            {users.map((u: UserItem) => (
              <div
                key={u.id}
                className="flex items-center gap-4 p-4 hover:bg-surface-50/50 transition-all"
              >
                <div className="size-10 rounded-xl bg-gradient-to-br from-surface-100 to-surface-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-surface-500">
                    {u.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-surface-800 truncate">{u.name}</p>
                  <p className="text-xs text-surface-400 truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {u.island?.name && (
                    <span className="flex items-center gap-1 text-[10px] text-surface-400 font-medium">
                      <MapPin size={10} />
                      {u.island.name}
                    </span>
                  )}
                  <Badge variant="outline" className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${ROLE_COLORS[u.role?.name] || ''}`}>
                    {ROLE_LABELS[u.role?.name] || u.role?.name}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
