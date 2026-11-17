import { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { 
  Users, 
  IndianRupee, 
  Cpu, 
  Activity,
  ArrowUpRight,
  Zap,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import MetricCard from '../../components/admin/MetricCard';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const REVENUE_DATA = [
  { name: 'Mon', amount: 45000 },
  { name: 'Tue', amount: 52000 },
  { name: 'Wed', amount: 48000 },
  { name: 'Thu', amount: 61000 },
  { name: 'Fri', amount: 55000 },
  { name: 'Sat', amount: 72000 },
  { name: 'Sun', amount: 68000 },
];

const USER_DATA = [
  { name: 'Jan', count: 400 },
  { name: 'Feb', count: 600 },
  { name: 'Mar', count: 800 },
  { name: 'Apr', count: 1200 },
  { name: 'May', count: 1900 },
  { name: 'Jun', count: 2400 },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const token = await user?.getIdToken();
        const { data } = await axios.get('/api/admin/metrics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch admin metrics", err);
      }
    };
    fetchMetrics();
  }, [user]);

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Users" 
          value={metrics?.activeUsers || "2,458"} 
          change="+12.5%" 
          isPositive={true} 
          icon={Users} 
          color="purple" 
        />
        <MetricCard 
          title="Revenue" 
          value={`₹${(metrics?.totalRevenue || 672500).toLocaleString()}`} 
          change="+8.2%" 
          isPositive={true} 
          icon={IndianRupee} 
          color="teal" 
        />
        <MetricCard 
          title="AI Tasks" 
          value={metrics?.aiTasks || "12,400"} 
          change="+24.1%" 
          isPositive={true} 
          icon={Cpu} 
          color="blue" 
        />
        <MetricCard 
          title="Conversion" 
          value={metrics?.conversionRate || "14.2%"} 
          change="-2.1%" 
          isPositive={false} 
          icon={Activity} 
          color="amber" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Revenue Dynamics</h3>
              <p className="text-xs text-zinc-500 font-medium">Daily collection and growth projection</p>
            </div>
            <div className="flex gap-2">
              <button className="bg-zinc-900 text-zinc-300 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">Download Report</button>
            </div>
          </div>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A259FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#A259FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#A259FF" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
            <h3 className="text-xl font-bold text-white tracking-tight mb-6">Live Node Stats</h3>
            <div className="space-y-6">
              {[
                { label: "Firebase Core", status: "Operational", color: "text-teal-500", icon: ShieldCheck },
                { label: "Neural-Veda Engine", status: "High Priority", color: "text-purple-500", icon: Zap },
                { label: "Cloud Ingress", status: "Stable", color: "text-teal-500", icon: Globe },
              ].map((node, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-2xl border border-zinc-900">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 border border-zinc-800", node.color.replace('text-', 'text-'))}>
                       <node.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{node.label}</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{node.status}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-black italic tracking-tight mb-2">Upgrade Infrastructure?</h3>
              <p className="text-sm opacity-80 mb-6 font-medium">Scale your compute resources to handle 50k+ daily Ayurvedic scans.</p>
              <button className="bg-white text-purple-600 font-black uppercase text-[10px] tracking-widest px-6 py-3 rounded-xl shadow-xl hover:scale-105 transition-all">
                Scale Now
              </button>
            </div>
            <Cpu className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12 group-hover:rotate-0 transition-all duration-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
