import React from 'react';
import { motion } from 'motion/react';
import { Plus, History, Users, Tag } from 'lucide-react';
import { cn } from '../../lib/utils';

export const WalletActions = ({ onAddBalance, onHistory, onRefer, onOffers }: { onAddBalance: () => void, onHistory: () => void, onRefer: () => void, onOffers: () => void }) => {
    const actions = [
        { icon: <Plus className="w-6 h-6" />, label: 'Topup', onClick: onAddBalance, primary: true },
        { icon: <History className="w-6 h-6" />, label: 'History', onClick: onHistory },
        { icon: <Users className="w-6 h-6" />, label: 'Refer', onClick: onRefer },
        { icon: <Tag className="w-6 h-6" />, label: 'Offers', onClick: onOffers },
    ];

    return (
        <div className="px-6 sm:px-10 mt-20 relative z-50 grid grid-cols-4 gap-4">
            {actions.map((item, i) => (
                <motion.button key={i} whileHover={{ y: -8 }} whileTap={{ scale: 0.95 }} onClick={item.onClick} className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "w-20 h-20 sm:w-24 sm:h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-300 shadow-xl border",
                        item.primary ? "bg-black text-white border-white/10" : "bg-white text-gray-400 border-black/5 hover:border-black/20"
                    )}>
                        {item.icon}
                    </div>
                    <p className="text-[10px] font-black text-black uppercase tracking-widest">{item.label}</p>
                </motion.button>
            ))}
        </div>
    );
};
