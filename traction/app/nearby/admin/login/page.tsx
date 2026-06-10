'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Loader2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/nearby-stores/nearby-auth-store';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/nearby/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Login failed'); setLoading(false); return; }
      setUser(data.user);
      router.push('/nearby/admin');
    } catch {
      setError('Something went wrong');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center font-sans p-6">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8"
        >
          <div className="w-16 h-16 bg-red-50 text-[#e62e3d] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-gray-500 text-center text-sm mb-8">Please enter your credentials to access the admin portal.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-lg text-sm text-[#e62e3d] bg-[#fce9ea] border border-[#fce9ea] text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Admin Username" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 pl-11 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#e62e3d] focus:ring-2 focus:ring-[#e62e3d]/15 transition-all text-gray-900" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gray-900 text-white rounded-xl font-bold text-[15px] hover:bg-black transition-all duration-150 ease-in-out active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>
        </motion.div>
        
        <div className="text-center mt-6">
          <button onClick={() => router.push('/nearby/login')} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            &larr; Back to Member Login
          </button>
        </div>
      </div>
    </div>
  );
}
