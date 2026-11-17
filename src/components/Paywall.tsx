import React from 'react';
import { motion } from 'motion/react';
import { getFeaturePricing } from '../lib/pricing';

export default function Paywall({ featureId, onSelect }: { featureId: string, onSelect: (planId: string) => void }) {
    const pricing = getFeaturePricing(featureId);

    return (
        <div className="p-6">
            <h2 className="text-2xl font-black mb-6 text-center">Unlock Full Report</h2>
            <div className="space-y-4">
                {pricing.plans.map((plan) => (
                    <motion.button
                      key={plan.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelect(plan.id)}
                      className={`w-full p-6 rounded-2xl border-2 text-left space-y-2 ${plan.id === 'pro' ? 'border-[#A259FF] bg-purple-50' : 'border-gray-100 bg-white'}`}
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-black text-lg">{plan.name}</span>
                            <span className="font-black text-xl">₹{plan.price}</span>
                        </div>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
