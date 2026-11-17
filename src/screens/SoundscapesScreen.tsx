import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import YouTube, { YouTubeProps } from 'react-youtube';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Volume2, 
  Waves, 
  Leaf, 
  Flame, 
  ChevronRight,
  Headphones,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Soundscape {
  id: string;
  title: string;
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'General';
  videoId: string;
  description: string;
  icon: any;
  color: string;
}

const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'vata-grounding',
    title: 'Vata Grounding Flute',
    dosha: 'Vata',
    videoId: 'W_O76v006Wk', // Deep Grounding Flute
    description: 'Earthy frequencies and bansuri flute to stabilize Vata energy.',
    icon: Leaf,
    color: 'emerald'
  },
  {
    id: 'pitta-cooling',
    title: 'Pitta Cooling Streams',
    dosha: 'Pitta',
    videoId: 'WpAtE0qX8M8', // Cooling Water Sound
    description: 'Refreshing water elements and soft woodwinds to soothe Pitta.',
    icon: Waves,
    color: 'blue'
  },
  {
    id: 'kapha-stimulate',
    title: 'Kapha Awakening',
    dosha: 'Kapha',
    videoId: 'CgzSuoX-6f0', // Brisk Rhythmic Music
    description: 'Stimulating tempo and rhythmic chants to energize Kapha.',
    icon: Flame,
    color: 'orange'
  },
  {
    id: 'om-universal',
    title: 'The Primordial Om',
    dosha: 'General',
    videoId: '8Xzk6R6fI-s', // Ancient Om Chanting
    description: 'Deep 432Hz Om vibrations for universal healing and aura alignment.',
    icon: Sparkles,
    color: 'gold'
  }
];

export default function SoundscapesScreen({ userData }: { userData: any }) {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef<any>(null);

  const userDosha = userData?.dosha || 'General';

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    playerRef.current = event.target;
    setIsLoading(false);
  };

  const onPlayerStateChange: YouTubeProps['onStateChange'] = (event) => {
    // 1 = Playing, 2 = Paused
    if (event.data === 1) {
      setIsPlaying(true);
      setIsLoading(false);
    } else if (event.data === 2) {
      setIsPlaying(false);
    }
  };

  const handlePlay = (s: Soundscape) => {
    if (activeId === s.id) {
      if (isPlaying) {
        playerRef.current?.pauseVideo();
      } else {
        playerRef.current?.playVideo();
      }
    } else {
      setIsLoading(true);
      setActiveId(s.id);
      // The player will auto-play if we change the videoId and have the right options
    }
  };

  const youtubeOptions: YouTubeProps['opts'] = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      loop: 1,
    },
  };

  return (
    <div className="min-h-screen bg-ayur-bg pb-32">
      {/* YouTube Player Section - Visible when active */}
      <AnimatePresence>
        {activeId && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black"
          >
            <div className="aspect-video w-full max-w-2xl mx-auto relative group">
              <YouTube 
                videoId={SOUNDSCAPES.find(s => s.id === activeId)?.videoId} 
                opts={{
                  height: '100%',
                  width: '100%',
                  playerVars: {
                    autoplay: 1,
                    controls: 1,
                    modestbranding: 1,
                    rel: 0,
                  },
                }} 
                onReady={onPlayerReady}
                onStateChange={onPlayerStateChange}
                className="absolute inset-0"
              />
              {!isPlaying && !isLoading && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none">
                  <Play className="w-16 h-16 text-white opacity-80" />
                </div>
              )}
              {isLoading && (
                 <div className="absolute inset-0 bg-black flex items-center justify-center">
                   <Loader2 className="w-12 h-12 text-ayur-neon animate-spin" />
                 </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <div className="px-6 pt-14 pb-8 bg-ayur-bg/80 backdrop-blur-xl border-b border-black/5 sticky top-0 z-20">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-black/5 rounded-2xl flex items-center justify-center text-gray-900 active:scale-90 transition-all border border-black/10 hover:bg-black/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="space-y-1">
            <h1 className="text-3xl font-display font-black text-gray-900 tracking-tight leading-none uppercase">Soundscapes</h1>
            <p className="text-[10px] font-black text-ayur-neon uppercase tracking-[0.3em] opacity-80">Ancient Vedic Audio AI</p>
          </div>
        </div>
      </div>

      <div className="px-6 pt-10 space-y-10">
        {/* Recommendation Card */}
        <div className="premium-card p-10 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-ayur-neon/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-ayur-neon">
                <Headphones className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black uppercase tracking-widest text-ayur-neon">Recommended For You</h3>
                <p className="text-2xl font-display font-black tracking-tight">{userDosha} Alignment</p>
              </div>
            </div>
            <p className="text-xs font-medium text-white/50 leading-relaxed max-w-[200px]">
              Our AI tuning fork recommends these frequencies for your {userDosha} core signature.
            </p>
            <button 
              disabled={isLoading}
              onClick={() => {
                const s = SOUNDSCAPES.find(sc => sc.dosha === userDosha) || SOUNDSCAPES[0];
                handlePlay(s);
              }}
              className="glow-button-green py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activate Recommended Aura'}
            </button>
            <p className="text-[8px] text-white/30 text-center uppercase tracking-widest font-black">
              * Powered by YouTube High-Definition Neural Audio
            </p>
          </div>
        </div>

        {/* Library */}
        <div className="space-y-6">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
            <Volume2 className="w-4 h-4" />
            Neural-Veda Library
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {SOUNDSCAPES.map((s) => (
              <button 
                key={s.id}
                disabled={isLoading && activeId === s.id}
                onClick={() => handlePlay(s)}
                className={cn(
                   "w-full flex items-center gap-6 p-6 rounded-3xl transition-all border text-left group relative overflow-hidden",
                   activeId === s.id ? "bg-white border-black" : "bg-white border-black/5 hover:border-black/20"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all shadow-sm",
                  activeId === s.id ? `bg-ayur-neon text-black` : `bg-gray-100 text-gray-500`
                )}>
                  {activeId === s.id ? (
                    isLoading ? (
                      <Loader2 className="w-7 h-7 animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-7 h-7" />
                    ) : (
                      <Play className="w-7 h-7" />
                    )
                  ) : (
                    <s.icon className="w-7 h-7" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-black uppercase tracking-tight text-gray-900">{s.title}</p>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border",
                      s.dosha === 'Vata' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      s.dosha === 'Pitta' ? "bg-blue-50 text-blue-600 border-blue-100" :
                      s.dosha === 'Kapha' ? "bg-orange-50 text-orange-600 border-orange-100" :
                      "bg-ayur-gold/10 text-ayur-gold border-ayur-gold/20"
                    )}>
                      {s.dosha}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight line-clamp-1">{s.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  {activeId === s.id && isPlaying && !isLoading && (
                    <div className="flex gap-1 items-end h-4">
                      {[1, 2, 3, 4].map(i => (
                        <motion.div
                          key={i}
                          animate={{ height: [4, 16, 4] }}
                          transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          className="w-1 bg-ayur-neon rounded-full"
                        />
                      ))}
                    </div>
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-black transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white rounded-3xl border border-black/5 space-y-3">
            <Zap className="w-6 h-6 text-ayur-gold" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-tight">Instant Focus</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Neural entrainment for deep concentration.</p>
          </div>
          <div className="p-6 bg-white rounded-3xl border border-black/5 space-y-3">
            <Sparkles className="w-6 h-6 text-ayur-neon" />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-900 leading-tight">Vedic Chants</p>
            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Sacred vibrations to align your aura.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
