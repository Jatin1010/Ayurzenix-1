import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Play, Info } from 'lucide-react';

// Ad Frequency Logic
const AD_CONFIG = {
  interstitialFrequency: 2, // Show every 2 scans
  rewardedBenefit: 'Free Scan',
};

interface AdContextType {
  showInterstitial: (onClose?: () => void) => void;
  showRewarded: (onReward: () => void, onClose?: () => void) => void;
  canShowInterstitial: () => boolean;
}

const AdContext = createContext<AdContextType | null>(null);

export const useAds = () => {
  const context = useContext(AdContext);
  if (!context) throw new Error('useAds must be used within an AdProvider');
  return context;
};

export const AdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [interstitialVisible, setInterstitialVisible] = useState(false);
  const [rewardedVisible, setRewardedVisible] = useState(false);
  const [onAdClose, setOnAdClose] = useState<(() => void) | null>(null);
  const [onRewardEarned, setOnRewardEarned] = useState<(() => void) | null>(null);

  const canShowInterstitial = () => {
    const count = parseInt(localStorage.getItem('scan_count_for_ads') || '0');
    return count >= AD_CONFIG.interstitialFrequency;
  };

  const showInterstitial = (onClose?: () => void) => {
    if (onClose) onClose();
  };

  const showRewarded = (onReward: () => void, onClose?: () => void) => {
    setRewardedVisible(true);
    setOnRewardEarned(() => onReward);
    setOnAdClose(() => onClose || null);
  };

  return (
    <AdContext.Provider value={{ showInterstitial, showRewarded, canShowInterstitial }}>
      {children}
      
      {/* Mock Interstitial Ad */}
      <AnimatePresence>
      </AnimatePresence>

      {/* Mock Rewarded Ad */}
      <AnimatePresence>
        {rewardedVisible && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-gray-900 flex items-center justify-center p-6"
          >
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="h-48 bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center relative">
                <Play className="w-16 h-16 text-white/50" />
                <div className="absolute top-4 right-4 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-[10px] font-bold">
                  Reward in 5s
                </div>
              </div>
              <div className="p-8 text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-gray-900">Watch to Unlock</h3>
                  <p className="text-gray-500 text-sm">Watch this short video to get a 100% discount on your next AI Body Scan!</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setRewardedVisible(false);
                      if (onRewardEarned) onRewardEarned();
                      if (onAdClose) onAdClose();
                    }}
                    className="flex-1 bg-[#22C55E] text-white py-4 rounded-2xl font-black shadow-lg shadow-green-100"
                  >
                    Claim Reward
                  </button>
                  <button 
                    onClick={() => {
                      setRewardedVisible(false);
                      if (onAdClose) onAdClose();
                    }}
                    className="px-6 text-gray-400 font-bold"
                  >
                    Skip
                  </button>
                </div>
                <p className="text-[10px] text-gray-300 uppercase tracking-widest">Sponsored Content</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdContext.Provider>
  );
};

// --- Ad Components ---

// --- Real AdSense Component ---
export const AdSenseAd: React.FC<{ slot: string; format?: string; responsive?: string; className?: string }> = ({ 
  slot, 
  format = 'auto', 
  responsive = 'true',
  className = ""
}) => {
  const adRef = useRef<HTMLModElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!adRef.current) return;

    const tryPushAd = () => {
      if (loadedRef.current || !adRef.current) return;

      try {
        const el = adRef.current;
        const parent = el.parentElement;
        if (!parent) return;

        const parentWidth = parent.offsetWidth;
        if (parentWidth < 250) return; // Wait for enough width

        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') return;

        const hasStatus = el.getAttribute('data-adsbygoogle-status');
        if (hasStatus) {
          loadedRef.current = true;
          return;
        }

        // Final verification of dimensions before push
        const rect = el.getBoundingClientRect();
        if (rect.width < 250) return;

        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        loadedRef.current = true;
      } catch (e) {
        if (e instanceof Error && (
          e.message.includes('already have ads in them') || 
          e.message.includes('No slot size') ||
          e.toString().includes('No slot size')
        )) {
          loadedRef.current = true; 
          return;
        }
        // Only log actual meaningful errors
        if (e instanceof Error && !e.message.includes('No slot size')) {
          console.error('AdSense error:', e);
        }
      }
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !loadedRef.current) {
          tryPushAd();
        }
      });
    }, { threshold: 0.1 });

    observer.observe(adRef.current);

    // Also fallback timeout in case intersection observer doesn't trigger
    const timeout = setTimeout(tryPushAd, 2000);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [slot]); 

  return (
    <div className={`w-full overflow-hidden my-4 flex justify-center ${className}`}>
      <ins
        key={slot}
        ref={adRef}
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          minWidth: '250px', 
          minHeight: '100px',
          width: '100%',
          margin: '0 auto'
        }}
        data-ad-client="ca-pub-2891634924200097"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
};

export const BannerAd: React.FC<{ size?: 'small' | 'large' }> = ({ size = 'large' }) => {
  // Use a generic placeholder slot for now, user needs to replace with actual slot IDs from AdSense console
  // Slot ID '9738018241' is a placeholder
  return (
    <div className={`w-full bg-gray-50/50 rounded-2xl overflow-hidden ${size === 'small' ? 'min-h-[100px]' : 'min-h-[250px]'}`}>
      <AdSenseAd slot="9738018241" />
      <div className="px-4 pb-2 flex items-center justify-between">
        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Sponsored Content</span>
        <Info className="w-2.5 h-2.5 text-gray-200" />
      </div>
    </div>
  );
};

export const NativeAd: React.FC = () => {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-xl shadow-gray-100/50 relative">
      <div className="p-2 border-b border-gray-50 flex justify-between items-center px-4">
        <span className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">Partner Recommendation</span>
        <Info className="w-2.5 h-2.5 text-gray-200" />
      </div>
      <AdSenseAd slot="9738018241" format="fluid" />
    </div>
  );
};
