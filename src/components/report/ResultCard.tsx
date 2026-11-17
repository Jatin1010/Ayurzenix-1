import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResultCardProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  layout?: 'vertical' | 'horizontal';
}

export default function ResultCard({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-black',
  iconBg = 'bg-stone-100',
  children,
  className,
  delay = 0,
  layout = 'vertical'
}: ResultCardProps) {
  const isHorizontal = layout === 'horizontal';

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className={cn(
        "bg-white rounded-[2.5rem] p-8 border border-black/5 shadow-xl relative overflow-hidden group", 
        isHorizontal ? "p-10" : "p-8",
        className
      )}
    >
      <div className={cn("flex flex-col", isHorizontal ? "md:flex-row md:items-start md:gap-12 space-y-6 md:space-y-0" : "space-y-6")}>
        <div className={cn("flex items-center justify-between shrink-0", isHorizontal ? "md:w-1/3" : "")}>
          <div className="flex items-center gap-4">
            {Icon && (
              <div className={cn(
                "rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shrink-0", 
                iconBg, 
                iconColor,
                isHorizontal ? "w-16 h-16" : "w-12 h-12"
              )}>
                <Icon className={isHorizontal ? "w-8 h-8" : "w-6 h-6"} />
              </div>
            )}
            <div className="space-y-0.5">
              {subtitle && <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">{subtitle}</p>}
              <h3 className={cn("font-black text-black tracking-tight uppercase italic", isHorizontal ? "text-2xl leading-tight" : "text-xl")}>{title}</h3>
            </div>
          </div>
        </div>
        
        {!isHorizontal && <div className="w-full h-px bg-stone-50" />}
        {isHorizontal && <div className="hidden md:block w-px self-stretch bg-stone-50" />}
        
        <div className={cn("relative z-10", isHorizontal ? "flex-1" : "")}>
          {children}
        </div>
      </div>
      
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </motion.section>
  );
}
