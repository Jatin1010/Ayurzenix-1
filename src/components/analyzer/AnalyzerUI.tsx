import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface SmartChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: string;
}

export const SmartChip = ({ label, selected, onClick, icon }: SmartChipProps) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "px-5 py-3 rounded-2xl border transition-all flex items-center gap-3",
      selected 
        ? "bg-black border-black text-white shadow-xl" 
        : "bg-white border-black/5 text-gray-700 hover:border-black/20"
    )}
  >
    {icon && <span className="text-xl">{icon}</span>}
    <span className="font-bold text-sm">{label}</span>
  </motion.button>
);

export const StepTitle = ({ children, subtitle }: { children: React.ReactNode, subtitle?: string }) => (
  <div className="space-y-3 mb-8">
    <motion.h2 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-3xl font-black text-black leading-tight tracking-tight"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 font-medium"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export const WellnessSlider = ({ 
  value, 
  onChange, 
  label, 
  minLabel, 
  maxLabel 
}: { 
  value: number, 
  onChange: (v: number) => void, 
  label: string, 
  minLabel: string, 
  maxLabel: string 
}) => (
  <div className="space-y-6">
    <div className="flex justify-between items-end">
      <p className="font-black text-black uppercase tracking-widest text-[10px]">{label}</p>
      <p className="text-2xl font-black text-ayur-purple">{value}%</p>
    </div>
    <div className="relative py-4">
      <input 
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black"
      />
      <div className="flex justify-between mt-4">
        <span className="text-[10px] font-bold text-gray-400 uppercase">{minLabel}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase">{maxLabel}</span>
      </div>
    </div>
  </div>
);
