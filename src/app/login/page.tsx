'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) { setError('Email atau password salah'); setLoading(false); }
    else { router.push('/'); router.refresh(); }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-accent-500/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute -bottom-40 left-1/3 w-80 h-80 bg-brand-600/15 rounded-full blur-[100px] animate-float" style={{ animationDelay: '0.8s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <Image
            src="/logo/blitz-logo-white.png"
            alt="BLITZ CRM"
            width={200}
            height={56}
            className="mx-auto mb-6 drop-shadow-xl"
            priority
          />
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-surface-400 mt-2">
            Sign in to your BLITZ CRM account
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-dark rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-danger-500/10 border border-danger-500/20 text-sm text-danger-400 animate-slide-down">
                <div className="size-5 rounded-full bg-danger-500/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@blitzpendidikan.id"
                  required
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-brand-500/20 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-surface-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-surface-500 focus:border-brand-500 focus:ring-brand-500/20 h-11 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 transition-all duration-300 hover:shadow-brand-500/40"
              disabled={loading}
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-surface-500 mt-8">
          2026 Blitz Bilingual Education. All rights reserved.
        </p>
      </div>
    </div>
  );
}
