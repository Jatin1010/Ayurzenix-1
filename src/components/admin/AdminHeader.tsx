import { useLocation } from 'react-router-dom';
import { 
  Bell, 
  Search,
  User
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminHeader() {
  const { userData } = useAuth();
  const location = useLocation();
  
  const getTitle = () => {
    const path = location.pathname;
    if (path === '/admin') return 'System Dashboard';
    if (path.includes('/users')) return 'User Management';
    if (path.includes('/ai-control')) return 'AI Master Control';
    if (path.includes('/revenue')) return 'Financial Intelligence';
    if (path.includes('/marketing')) return 'Marketing Engine';
    if (path.includes('/settings')) return 'Global Settings';
    return 'Admin';
  };

  return (
    <header className="h-20 border-b border-zinc-800 bg-black/50 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-30">
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-tight">{getTitle()}</h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search records..." 
            className="bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-purple-600/50 w-64"
          />
        </div>

        <button className="relative w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-purple-600 rounded-full border-2 border-black" />
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-zinc-800">
          <div className="text-right">
            <p className="text-xs font-bold text-white">{userData?.displayName || 'Admin'}</p>
            <p className="text-[10px] font-medium text-purple-500 uppercase tracking-widest">Master Node</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 flex items-center justify-center overflow-hidden">
             {userData?.photoURL ? (
               <img src={userData.photoURL} alt="Admin" className="w-full h-full object-cover" />
             ) : (
               <User className="w-5 h-5 text-zinc-500" />
             )}
          </div>
        </div>
      </div>
    </header>
  );
}
