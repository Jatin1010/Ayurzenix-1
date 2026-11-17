import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

const FAQS = [
  {
    q: "Do my wallet credits expire?",
    a: "No. Your Ayurvedic credits in the Vedic Wealth Vault never expire. You can use them today, next month, or next year to unlock any on-demand AI analysis or premium guidance."
  },
  {
    q: "Can I cancel my membership anytime?",
    a: "Absolutely. You can manage your subscription directly from your Profile settings. There are no exit fees, and you'll retain your Premium access until the end of your billing cycle."
  },
  {
    q: "Are the reports deeply personalized?",
    a: "Yes. Unlike generic wellness apps, Ayurzenix uses your unique biological markers, dosha constitution, and lifestyle data to generate high-precision healing protocols specific only to you."
  },
  {
    q: "Is payment processing secure?",
    a: "We use Razorpay, India's leading secure payment gateway. All transactions are 256-bit SSL encrypted. We never store your card details on our servers."
  },
  {
    q: "Will my report history stay saved?",
    a: "Yes. All reports you generate are permanently stored in your Biological Ledger. You can access them anytime, compare patterns, and share them with your doctors."
  }
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="px-6 py-24 max-w-3xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex p-2 bg-stone-100 rounded-2xl text-gray-400">
           <HelpCircle className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-black uppercase tracking-tight">Intelligence Support</h2>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest italic opacity-60">General queries about your transformation path</p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="group"
          >
            <button
               onClick={() => setExpanded(expanded === i ? null : i)}
               className={cn(
                 "w-full p-8 rounded-[2rem] text-left transition-all duration-500 flex justify-between items-center",
                 expanded === i ? "bg-white border border-ayur-purple/20 shadow-2xl" : "bg-white border border-black/5 hover:border-black/10 shadow-premium"
               )}
            >
              <span className="text-base font-black text-black uppercase tracking-tight leading-tight max-w-[85%]">{faq.q}</span>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                expanded === i ? "bg-ayur-purple text-white rotate-180" : "bg-stone-50 text-gray-400 group-hover:bg-black group-hover:text-white"
              )}>
                <ChevronDown className="w-5 h-5" />
              </div>
            </button>
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="overflow-hidden"
                >
                  <div className="p-8 pt-4">
                    <p className="text-base font-bold text-gray-500 italic leading-relaxed font-italic leading-relaxed border-l-4 border-ayur-purple/20 pl-6">
                      {faq.a}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
