import React from 'react';
import { Wallet, Bell } from 'lucide-react';
import { motion } from 'motion/react';

export const WalletHeader = () => (
    <div className="relative pt-14 sm:pt-16 px-6 sm:px-10 flex items-center justify-between z-50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-black shadow-2xl flex items-center justify-center p-3 relative group overflow-hidden">
                <Wallet className="w-6 h-6 text-ayur-teal relative z-10" />
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-black/50 uppercase tracking-[0.4em] leading-none">Vault Status</p>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-ayur-teal animate-pulse" />
                    <h2 className="text-sm font-black text-black uppercase tracking-tightest">Secure Wealth Vault</h2>
                </div>
            </div>
        </motion.div>
        <motion.button whileTap={{ scale: 0.9 }} className="w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-3xl border border-white/60 flex items-center justify-center text-black shadow-premium">
            <Bell className="w-6 h-6" />
        </motion.button>
    </div>
);
