import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Metric {
  label: string;
  value: number | string;
  icon: React.ReactNode | LucideIcon;
  color: string;
}

interface StandardMetricGridProps {
  metrics: Metric[];
}

export default function StandardMetricGrid({ metrics }: StandardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {(metrics || []).map((m, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-[2.5rem] p-6 border border-black/5 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all active:scale-[0.98] group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn("p-2.5 rounded-2xl transition-colors", m.color.replace('text-', 'bg-').replace('-600', '-50'), m.color)}>
              {typeof m.icon === 'function' ? <m.icon className="w-4 h-4" /> : m.icon}
            </div>
            <span className="text-xl font-black text-black">{m.value}{typeof m.value === 'number' ? '%' : ''}</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 leading-tight">{m.label}</p>
          {typeof m.value === 'number' && (
            <div className="mt-3 h-1 w-full bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: `${m.value}%` }}
                viewport={{ once: true }}
                className={cn("h-full", m.color.replace('text-', 'bg-'))}
              />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
