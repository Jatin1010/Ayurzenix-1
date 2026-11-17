import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Cpu, 
  IndianRupee, 
  Megaphone, 
  Settings,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const menu = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "AI Control", path: "/admin/ai-control", icon: Cpu },
    { name: "Revenue", path: "/admin/revenue", icon: IndianRupee },
    { name: "Marketing", path: "/admin/marketing", icon: Megaphone },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 p-6 border-r border-zinc-800 flex flex-col h-screen sticky top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-black italic text-white">A</div>
        <h1 className="text-xl font-bold text-white tracking-tight">Ayurzenix Admin</h1>
      </div>
      
      <nav className="space-y-1 flex-1">
        {menu.map((item) => (
          <Link 
            key={item.name} 
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
              path === item.path 
                ? "bg-purple-600/10 text-purple-400 border border-purple-600/20" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="pt-6 border-t border-zinc-800 space-y-2">
         <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 transition-all font-medium text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Exit Admin
        </button>
      </div>
    </aside>
  );
}
