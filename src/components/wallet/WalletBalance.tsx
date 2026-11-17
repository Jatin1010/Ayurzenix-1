import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, ShieldCheck } from 'lucide-react';

export const WalletBalance = ({ balance, onAddBalance }: { balance: number, onAddBalance: () => void }) => (
    <div className="relative mt-20 sm:mt-24 px-6 sm:px-10 flex flex-col items-center text-center z-40">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-lg space-y-10">
            <div className="space-y-4">
                <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.6em] leading-none">Net Liquid Healing Assets</p>
                <div className="relative inline-block">
                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <span className="text-4xl font-light text-black/20 mb-10">₹</span>
                        <h1 className="text-7xl sm:text-9xl font-black text-black tracking-tighter leading-none drop-shadow-2xl">
                            {balance.toLocaleString('en-IN')}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <motion.button whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.95 }} onClick={onAddBalance} className="px-8 py-5 rounded-[2.5rem] bg-black text-white shadow-glow-teal flex items-center justify-center gap-3 group border border-white/10">
                    <div className="w-6 h-6 rounded-lg bg-ayur-teal text-black flex items-center justify-center shadow-lg">
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em]">Add Balance</span>
                </motion.button>
                <div className="px-8 py-5 rounded-[2.5rem] bg-white shadow-premium border border-black/5 flex items-center justify-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-ayur-teal" />
                    <span className="text-[10px] font-black text-black uppercase tracking-[0.1em]">Encrypted</span>
                </div>
            </div>
        </motion.div>
    </div>
);
