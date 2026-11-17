import { motion } from 'motion/react';
import { Lightbulb } from 'lucide-react';

export const TipsBanner = () => {
    const tips = [
        "Drink warm water first thing in the morning to kickstart digestion.",
        "Include a variety of colors in your diet for balanced nutrition.",
        "Take 5 minutes of deep breathing before your first meal."
    ];
    
    return (
        <div className="px-6 py-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-ayur-teal mb-4 flex items-center gap-2">
                <Lightbulb className="w-4 h-4" /> Daily Wellness Tips
            </h3>
            <div className="space-y-3">
                {tips.map((tip, index) => (
                    <motion.p 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="text-sm font-medium text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    >
                        {tip}
                    </motion.p>
                ))}
            </div>
        </div>
    );
};
