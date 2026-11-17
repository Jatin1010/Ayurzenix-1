import { 
  IndianRupee, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  TrendingDown,
  Activity,
  CreditCard,
  History
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import MetricCard from '../../components/admin/MetricCard';

const REVENUE_METRICS = [
  { name: 'Direct Sales', value: 450000, color: '#A259FF' },
  { name: 'Subscription', value: 120000, color: '#00BFA6' },
  { name: 'Partner Integration', value: 65000, color: '#3B82F6' },
  { name: 'Admin Services', value: 37500, color: '#F59E0B' },
];

export default function Revenue() {
  return (
    <div className="space-y-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight uppercase">Financial Intelligence</h2>
          <p className="text-sm text-zinc-500 font-medium">Monitoring the velocity and flow of capital</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-2 flex gap-1">
           {['Daily', 'Weekly', 'Monthly', 'Annual'].map(p => (
             <button key={p} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
               {p}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Gross Volume" value="₹6,72,500" change="+14%" isPositive={true} icon={IndianRupee} color="purple" />
        <MetricCard title="Avg Transaction" value="₹275" change="+5%" isPositive={true} icon={Activity} color="teal" />
        <MetricCard title="Active Payouts" value="₹1,24,000" change="Stable" isPositive={true} icon={CreditCard} color="blue" />
        <MetricCard title="Churn Loss" value="₹8,500" change="-12%" isPositive={false} icon={TrendingDown} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
           <h3 className="text-xl font-bold text-white tracking-tight mb-8">Revenue Streams</h3>
           <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REVENUE_METRICS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                <XAxis dataKey="name" stroke="#555" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#555" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {REVENUE_METRICS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
           </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-8">
           <div className="flex items-center justify-between mb-8">
             <h3 className="text-xl font-bold text-white tracking-tight">Recent Ledger</h3>
             <History className="w-5 h-5 text-zinc-600" />
           </div>
           <div className="space-y-6">
              {[
                { name: "John Doe", type: "Wallet Topup", amount: "+ ₹500", time: "2 min ago", status: "Success" },
                { name: "Ayush Kumar", type: "Report Unlock", amount: "+ ₹199", time: "15 min ago", status: "Success" },
                { name: "Priya S.", type: "Pro Subscription", amount: "+ ₹999", time: "1 hr ago", status: "Success" },
                { name: "Vikram R.", type: "Wallet Topup", amount: "+ ₹200", time: "2 hr ago", status: "Failed", error: true },
              ].map((tx, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold", tx.error ? "bg-rose-500/10 text-rose-500" : "bg-teal-500/10 text-teal-500")}>
                      {tx.name[0]}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">{tx.name}</p>
                       <p className="text-[10px] text-zinc-600 font-medium">{tx.type} • {tx.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-xs font-black", tx.error ? "text-rose-500" : "text-white")}>{tx.amount}</p>
                    <p className={cn("text-[9px] font-black uppercase tracking-widest", tx.error ? "text-rose-600" : "text-zinc-600")}>{tx.status}</p>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full mt-10 py-3 rounded-xl border border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
             View Full Ledger
           </button>
        </div>
      </div>
    </div>
  );
}
