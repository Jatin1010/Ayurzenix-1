import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  color: 'purple' | 'teal' | 'amber' | 'blue';
}

export default function MetricCard({ title, value, change, isPositive, icon: Icon, color }: MetricCardProps) {
  const colors = {
    purple: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    teal: "text-teal-500 bg-teal-500/10 border-teal-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20"
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-zinc-950 border border-zinc-900 p-6 rounded-[2rem] relative overflow-hidden group transition-all hover:bg-zinc-900/50"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {change && (
          <div className={cn(
            "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
            isPositive ? "text-teal-500 bg-teal-500/10" : "text-rose-500 bg-rose-500/10"
          )}>
            {change}
          </div>
        )}
      </div>
      
      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
      <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
      
      {/* Decorative gradient */}
      <div className={cn(
        "absolute -bottom-8 -right-8 w-24 h-24 blur-[40px] opacity-20 rounded-full",
        color === 'purple' ? "bg-purple-600" : color === 'teal' ? "bg-teal-600" : "bg-blue-600"
      )} />
    </motion.div>
  );
}
