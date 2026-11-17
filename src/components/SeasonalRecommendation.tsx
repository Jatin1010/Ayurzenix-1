import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CloudSun, Leaf, Utensils, Zap, Sparkles, ChevronRight, Info } from 'lucide-react';
import { getSeasonalRecommendations } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';
import { cn } from '../lib/utils';

export default function SeasonalRecommendation() {
  const { language, t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'diet' | 'lifestyle' | 'herbs'>('diet');

  const getRitu = () => {
    const month = new Date().getMonth(); // 0-indexed
    if (month === 0 || month === 1) return 'Shishira'; // Jan-Feb
    if (month === 2 || month === 3) return 'Vasanta'; // Mar-Apr
    if (month === 4 || month === 5) return 'Grishma'; // May-Jun
    if (month === 6 || month === 7) return 'Varsha'; // Jul-Aug
    if (month === 8 || month === 9) return 'Sharad'; // Sep-Oct
    return 'Hemanta'; // Nov-Dec
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const ritu = getRitu();
        const langName = {
          en: 'English', hi: 'Hindi', bn: 'Bengali', ta: 'Tamil', te: 'Telugu',
          mr: 'Marathi', gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi'
        }[language] || 'English';

        const result = await getSeasonalRecommendations(ritu, langName);
        setData(result);
      } catch (error) {
        console.error('Error fetching seasonal recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [language]);

  if (loading) {
    return (
      <div className="w-full my-8">
        <div className="premium-card p-6 h-48 animate-pulse flex flex-col justify-center items-center">
          <CloudSun className="w-8 h-8 text-gray-300 mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-2 w-48 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="w-full my-8"
    >
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-stone-950 p-1 shadow-2xl">
        {/* Animated Background Glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-ayur-neon/20 via-ayur-teal/20 to-ayur-gold/20 blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
        
        <div className="relative rounded-[2.3rem] bg-stone-900 overflow-hidden">
          {/* Header Section */}
          <div className="p-6 pb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ayur-neon/10 flex items-center justify-center border border-ayur-neon/20">
                  <CloudSun className="w-5 h-5 text-ayur-neon" />
                </div>
                <div>
                  <h3 className="text-white font-black uppercase tracking-widest text-xs">{t.ritucharya.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-ayur-neon font-black text-xl">{data.seasonName}</span>
                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-tight">{t.ritucharya.activeSeason}</span>
                  </div>
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-ayur-gold animate-pulse" />
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-6 group-hover:border-ayur-neon/30 transition-colors">
              <div className="flex gap-3">
                <Info className="w-4 h-4 text-ayur-neon shrink-0 mt-0.5" />
                <p className="text-white/80 text-xs italic leading-relaxed font-medium">
                  "{data.doshaEffect}"
                </p>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 mb-6">
              {(['diet', 'lifestyle', 'herbs'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 px-2 rounded-2xl flex items-center justify-center gap-2 transition-all duration-500 border",
                    activeTab === tab 
                      ? "bg-ayur-neon text-black border-ayur-neon font-black" 
                      : "bg-white/5 text-white/60 border-white/10 font-bold hover:bg-white/10"
                  )}
                >
                  {tab === 'diet' && <Utensils className="w-3.5 h-3.5" />}
                  {tab === 'lifestyle' && <Zap className="w-3.5 h-3.5" />}
                  {tab === 'herbs' && <Leaf className="w-3.5 h-3.5" />}
                  <span className="text-[10px] uppercase tracking-wider">{t.ritucharya[tab]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* List Content */}
          <div className="px-6 pb-8 min-h-[160px]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                {data[activeTab]?.map((item: string, idx: number) => (
                  <motion.li 
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-ayur-neon/30 transition-all group/item"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-ayur-neon group-hover/item:scale-150 transition-transform" />
                    <span className="text-white/90 text-sm font-medium">{item}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* Footer CTA */}
          <div className="bg-gradient-to-r from-stone-950 to-stone-900 p-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-white/40 text-[9px] font-black uppercase tracking-widest">{t.ritucharya.aiSuggestion}</span>
            <div className="flex items-center gap-1 text-ayur-neon group/btn cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-tighter">{t.ritucharya.viewFullGuide}</span>
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
