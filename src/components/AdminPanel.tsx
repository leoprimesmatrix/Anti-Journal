import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, User as UserIcon, Shield, ShieldOff, CheckCircle, XCircle, LogOut, ArrowLeft } from 'lucide-react';
import { db, auth } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

interface UserProfile {
  id: string;
  email: string;
  tier: string;
  approved: boolean;
  isBanned: boolean;
  totalReleases: number;
  role?: string;
}

const AdminPanel = ({ onBack }: { onBack: () => void }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching users:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBanned: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling ban:", error);
    }
  };

  const handleToggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        approved: !currentStatus
      });
    } catch (error) {
      console.error("Error toggling approval:", error);
    }
  };

  const handleUpdateTier = async (userId: string, newTier: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        tier: newTier
      });
    } catch (error) {
      console.error("Error updating tier:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={onBack}
                className="p-2 rounded-full hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h1 className="text-4xl font-display tracking-tight">Admin Protocol</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs uppercase tracking-widest"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search users by email or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/20 transition-colors liquid-glass"
            />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl liquid-glass border border-white/10 space-y-1">
            <p className="text-xs uppercase tracking-widest text-white/40">Total Users</p>
            <p className="text-3xl font-display">{users.length}</p>
          </div>
          <div className="p-6 rounded-3xl liquid-glass border border-white/10 space-y-1">
            <p className="text-xs uppercase tracking-widest text-white/40">Pending Approval</p>
            <p className="text-3xl font-display text-amber-400">{users.filter(u => !u.approved).length}</p>
          </div>
          <div className="p-6 rounded-3xl liquid-glass border border-white/10 space-y-1">
            <p className="text-xs uppercase tracking-widest text-white/40">Banned</p>
            <p className="text-3xl font-display text-red-400">{users.filter(u => u.isBanned).length}</p>
          </div>
        </div>

        {/* Users List */}
        <div className="rounded-3xl liquid-glass border border-white/10 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40 font-medium">User</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40 font-medium">Activity</th>
                  <th className="px-6 py-4 text-xs uppercase tracking-widest text-white/40 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                            <UserIcon className="w-5 h-5 text-white/60" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{user.email}</span>
                            <span className="text-[10px] text-white/20 font-mono">{user.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                            user.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {user.approved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {user.approved ? 'Approved' : 'Pending'}
                          </div>
                          {user.isBanned && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400">
                              <ShieldOff className="w-3 h-3" />
                              Banned
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-white/60">{user.totalReleases} releases</span>
                          <select
                            value={user.tier}
                            onChange={(e) => handleUpdateTier(user.id, e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60 focus:outline-none focus:border-white/20 hover:text-white transition-colors cursor-pointer w-fit"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleToggleApproval(user.id, user.approved)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.approved 
                                ? 'hover:bg-amber-500/20 text-amber-400' 
                                : 'hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                            title={user.approved ? "Revoke Approval" : "Approve User"}
                          >
                            {user.approved ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                          </button>
                          <button
                            onClick={() => handleToggleBan(user.id, user.isBanned)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isBanned 
                                ? 'hover:bg-emerald-500/20 text-emerald-400' 
                                : 'hover:bg-red-500/20 text-red-400'
                            }`}
                            title={user.isBanned ? "Unban User" : "Ban User"}
                          >
                            {user.isBanned ? <Shield className="w-5 h-5" /> : <ShieldOff className="w-5 h-5" />}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {filteredUsers.map((user) => (
                <motion.div 
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 space-y-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                        <UserIcon className="w-5 h-5 text-white/60" />
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-sm font-medium truncate">{user.email}</span>
                        <span className="text-[10px] text-white/20 font-mono truncate">{user.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      user.approved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {user.approved ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.approved ? 'Approved' : 'Pending'}
                    </div>
                    {user.isBanned && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider bg-red-500/10 text-red-400">
                        <ShieldOff className="w-3 h-3" />
                        Banned
                      </div>
                    )}
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs text-white/60">{user.totalReleases} releases</span>
                      <select
                        value={user.tier}
                        onChange={(e) => handleUpdateTier(user.id, e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest text-white/60 focus:outline-none focus:border-white/20 hover:text-white transition-colors cursor-pointer"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleToggleApproval(user.id, user.approved)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                        user.approved 
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400' 
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {user.approved ? <><XCircle className="w-3.5 h-3.5" /> Revoke</> : <><CheckCircle className="w-3.5 h-3.5" /> Approve</>}
                    </button>
                    <button
                      onClick={() => handleToggleBan(user.id, user.isBanned)}
                      className={`px-3 py-1.5 rounded-lg transition-colors text-xs uppercase tracking-wider flex items-center gap-1.5 ${
                        user.isBanned 
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400' 
                          : 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                      }`}
                    >
                      {user.isBanned ? <><Shield className="w-3.5 h-3.5" /> Unban</> : <><ShieldOff className="w-3.5 h-3.5" /> Ban</>}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          {filteredUsers.length === 0 && !loading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-white/20" />
              </div>
              <p className="text-white/40">No users found matching your search.</p>
            </div>
          )}
          
          {loading && (
            <div className="py-20 text-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
