import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  Shield, 
  Calendar,
  IndianRupee,
  Loader2
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export default function Users() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await user?.getIdToken();
        const { data } = await axios.get('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch admin users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(u => 
    u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">User Collective</h2>
          <p className="text-sm text-zinc-500 font-medium">Manage the identities within the Ayurzenix ecosystem</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Filter by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-zinc-950 border border-zinc-900 rounded-2xl py-4 pl-12 pr-6 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-600/50 w-full md:w-80"
            />
          </div>
          <button className="bg-zinc-950 border border-zinc-900 p-4 rounded-2xl text-zinc-500 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Retrieving Records...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-900 text-left">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Status & Plan</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Wallet</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Registration</th>
                  <th className="px-8 py-6 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                <AnimatePresence>
                  {filteredUsers.map((u, i) => (
                    <motion.tr 
                      key={u.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-zinc-900/50 transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                            {u.photoURL ? (
                              <img src={u.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-zinc-600 font-black">{u.displayName?.[0] || '?'}</div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">{u.displayName || 'Unknown'}</p>
                            <p className="text-xs text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                           <div className={cn(
                             "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest w-fit",
                             u.plan === 'premium' ? "bg-teal-500/10 text-teal-500" : "bg-zinc-900 text-zinc-500"
                           )}>
                             {u.plan || 'Free Tier'}
                           </div>
                           {u.is_admin && (
                             <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 text-[9px] font-black uppercase tracking-widest w-fit">
                               <Shield className="w-2.5 h-2.5" />
                               Admin
                             </div>
                           )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-zinc-300 font-mono text-sm">
                           <IndianRupee className="w-3 h-3 text-zinc-500" />
                           {Number(u.wallet_balance || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-2 text-zinc-500 text-xs">
                           <Calendar className="w-3 h-3" />
                           {u.createdAt ? new Date(u.createdAt._seconds * 1000).toLocaleDateString() : 'N/A'}
                         </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="text-zinc-600 hover:text-white transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
        
        {filteredUsers.length === 0 && !loading && (
          <div className="p-20 text-center">
            <UsersIcon className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
            <p className="text-zinc-500 text-sm font-medium">No identities found matching your criteria</p>
          </div>
        )}

        <div className="px-8 py-6 border-t border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">Showing {filteredUsers.length} of {users.length} Records</p>
           <div className="flex gap-2">
             <button className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-500 text-[10px] font-black uppercase tracking-widest disabled:opacity-50" disabled>Previous</button>
             <button className="px-4 py-2 rounded-xl bg-zinc-900 text-zinc-300 text-[10px] font-black uppercase tracking-widest hover:text-white">Next Record Set</button>
           </div>
        </div>
      </div>
    </div>
  );
}
