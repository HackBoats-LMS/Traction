'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/atlas-stores/atlas-auth-store';
import { ShieldCheck, Search, Loader2, Upload, UserPlus, XCircle, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/atlas-ui/avatar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  profession: string;
  avatar: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Global settings state
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  const [isUpdatingAccess, setIsUpdatingAccess] = useState(false);

  // Invite states
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  
  // Bulk upload states
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/atlas/dashboard');
    }
  }, [user, authLoading, router]);

  const fetchUsersAndSettings = async () => {
    setLoading(true);
    try {
      const [usersRes, settingsRes] = await Promise.all([
        fetch('/atlas/api/admin/users'),
        fetch('/atlas/api/admin/settings')
      ]);
      const usersData = await usersRes.json();
      const settingsData = await settingsRes.json();
      
      if (usersData.users) setUsers(usersData.users);
      if (settingsData.isAccessOpen !== undefined) setIsAccessOpen(settingsData.isAccessOpen);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchUsersAndSettings();
    }
  }, [user]);

  const toggleRole = async (userId: string, currentRole: string) => {
    if (userId === 'admin_user_id') return;
    setUpdatingId(userId);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const res = await fetch('/atlas/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      console.error('Failed to update role', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (userId === 'admin_user_id') return;
    if (!confirm('Are you sure you want to permanently delete this user? This cannot be undone.')) return;
    
    setUpdatingId(userId);
    try {
      const res = await fetch(`/atlas/api/admin/users?userId=${userId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
      }
    } catch (err) {
      console.error('Failed to delete user', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) return;
    
    setIsInviting(true);
    setInviteMessage('');
    try {
      const res = await fetch('/atlas/api/admin/users/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, name: newName })
      });
      const data = await res.json();
      if (res.ok) {
        setInviteMessage('User invited successfully!');
        setNewEmail('');
        setNewName('');
        fetchUsersAndSettings();
      } else {
        setInviteMessage(data.error || 'Failed to invite user');
      }
    } catch (err) {
      setInviteMessage('An error occurred');
    } finally {
      setIsInviting(false);
      setTimeout(() => setInviteMessage(''), 5000);
    }
  };

  const toggleAccessMode = async () => {
    setIsUpdatingAccess(true);
    const newAccess = !isAccessOpen;
    try {
      const res = await fetch('/atlas/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAccessOpen: newAccess })
      });
      if (res.ok) {
        setIsAccessOpen(newAccess);
      }
    } catch (err) {
      console.error('Failed to update access mode', err);
    } finally {
      setIsUpdatingAccess(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setInviteMessage('');
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Basic CSV parser (expects Name,Email format or just Email)
        const lines = text.split('\n');
        const newUsers = lines.map(line => {
          const parts = line.split(',');
          if (parts.length >= 2) return { name: parts[0].trim(), email: parts[1].trim() };
          return { name: '', email: parts[0].trim() };
        }).filter(u => u.email && u.email.includes('@'));

        if (newUsers.length === 0) {
          setInviteMessage('No valid emails found in CSV');
          setIsUploading(false);
          return;
        }

        const res = await fetch('/atlas/api/admin/users/bulk-invite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ users: newUsers })
        });
        const data = await res.json();
        
        if (res.ok) {
          setInviteMessage(`Success: Added ${data.addedCount} users. Skipped ${data.skippedCount} duplicates.`);
          fetchUsersAndSettings();
        } else {
          setInviteMessage(data.error || 'Failed to bulk upload');
        }
      } catch (err) {
        setInviteMessage('Error processing CSV');
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (authLoading || user?.role !== 'admin') {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-gray-400" /></div>;
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="text-[#e62e3d]" size={28} />
            User Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage global network settings and members.</p>
        </div>
      </div>

      {/* Global Settings Section */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Global Network Access</h2>
          <p className="text-sm text-gray-500 max-w-2xl">
            {isAccessOpen 
              ? "Open Access Mode: Anyone with a Google account can currently log in and automatically join the network."
              : "Closed Access Mode: Only users explicitly invited below can access the network."}
          </p>
        </div>
        <button
          onClick={toggleAccessMode}
          disabled={isUpdatingAccess}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${isAccessOpen ? 'bg-green-500' : 'bg-gray-300'}`}
          role="switch"
          aria-checked={isAccessOpen}
        >
          <span className="sr-only">Toggle network access</span>
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAccessOpen ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </div>

      {/* Invite Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Single Invite */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserPlus size={20} className="text-[#e62e3d]"/>
            Invite Member
          </h2>
          <form onSubmit={handleInvite} className="space-y-4">
            <input 
              type="text" 
              placeholder="Name (Optional)" 
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-black focus:outline-none focus:border-[#e62e3d] focus:ring-1 focus:ring-[#e62e3d]"
            />
            <input 
              type="email" 
              placeholder="Email address *" 
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-black placeholder:text-black focus:outline-none focus:border-[#e62e3d] focus:ring-1 focus:ring-[#e62e3d]"
            />
            <button
              type="submit"
              disabled={isInviting || !newEmail}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#e62e3d] text-white text-sm font-bold rounded-xl hover:bg-[#d02432] transition-colors disabled:opacity-50"
            >
              {isInviting ? <Loader2 size={18} className="animate-spin"/> : 'Add to Network'}
            </button>
          </form>
        </div>

        {/* Bulk Invite */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Upload size={20} className="text-[#e62e3d]"/>
              Bulk Import (CSV)
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              Upload a CSV file to add multiple members at once. Format should be: <br/>
              <code className="bg-gray-100 px-1 rounded">Name,Email</code> (one per line)
            </p>
          </div>
          
          <div className="relative">
            <input 
              type="file" 
              accept=".csv"
              ref={fileInputRef}
              onChange={handleBulkUpload}
              disabled={isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed rounded-xl text-sm font-bold transition-colors ${isUploading ? 'bg-gray-50 border-gray-200 text-gray-400' : 'bg-red-50 border-red-200 text-[#e62e3d] hover:bg-red-100'}`}>
              {isUploading ? <Loader2 size={18} className="animate-spin"/> : <><Upload size={18}/> Select CSV File</>}
            </div>
          </div>
        </div>
      </div>

      {inviteMessage && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${inviteMessage.includes('Error') || inviteMessage.includes('Failed') || inviteMessage.includes('already exists') ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
          {inviteMessage}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Network Members ({filteredUsers.length})</h3>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#e62e3d]"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Added On</th>
                <th className="px-6 py-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <motion.tr 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    key={u.id} 
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name || 'Unknown User'} avatar={u.avatar} size="sm" />
                        <div>
                          <p className="font-bold text-gray-900">{u.name || 'Invited User'}</p>
                          <p className="text-xs text-gray-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {u.id !== 'admin_user_id' && (
                          <>
                            <button
                              onClick={() => toggleRole(u.id, u.role)}
                              disabled={updatingId === u.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                            >
                              {updatingId === u.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : u.role === 'admin' ? (
                                'Revoke Admin'
                              ) : (
                                'Make Admin'
                              )}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              disabled={updatingId === u.id}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                              title="Delete User"
                            >
                              {updatingId === u.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={16} />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
