import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, Volume2, Music, Wind, Coffee, Moon, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const TRACKS = [
  { 
    id: 'vata', 
    title: 'Grounding Earth', 
    subtitle: 'Balancing Vata', 
    icon: Wind, 
    color: 'from-amber-500/20 to-orange-500/20',
    duration: '15:00',
    description: 'Deep, resonant frequencies to calm a restless mind.',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-meditation-soft-cricket-ambience-142.mp3'
  },
  { 
    id: 'pitta', 
    title: 'Lunar Cooling', 
    subtitle: 'Balancing Pitta', 
    icon: Moon, 
    color: 'from-blue-500/20 to-cyan-500/20',
    duration: '12:00',
    description: 'Sitar & Water melodies to soothe internal heat.',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-zen-meditation-bells-585.mp3'
  },
  { 
    id: 'kapha', 
    title: 'Solar Awakening', 
    subtitle: 'Balancing Kapha', 
    icon: Coffee, 
    color: 'from-rose-500/20 to-red-500/20',
    duration: '10:00',
    description: 'Upbeat rhythms to clear congestion and lethargy.',
    audioUrl: 'https://assets.mixkit.co/music/preview/mixkit-morning-sunrise-241.mp3'
  }
];

export function VedicSoundscapes() {
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onwaiting = () => setIsLoading(true);
      audioRef.current.oncanplay = () => setIsLoading(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleTrackClick = (id: string, url: string) => {
    if (!audioRef.current) return;

    if (activeTrack === id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    } else {
      setIsLoading(true);
      audioRef.current.src = url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setActiveTrack(id);
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Audio Playback Error:", err);
          setIsLoading(false);
        });
    }
  };

  return (
    <div className="px-6 py-10">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-black tracking-tight uppercase">Sound Therapy</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance your frequency</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-ayur-neon/10 flex items-center justify-center">
            <Music className="w-5 h-5 text-ayur-neon" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {TRACKS.map((track) => (
            <motion.div
              key={track.id}
              whileHover={{ scale: 1.01 }}
              className={cn(
                "p-6 rounded-[2.5rem] border transition-all relative overflow-hidden group cursor-pointer",
                activeTrack === track.id
                  ? "bg-ayur-neon border-ayur-neon shadow-2xl"
                  : "bg-white border-black/5 hover:border-black/10"
              )}
              onClick={() => handleTrackClick(track.id, track.audioUrl)}
            >
              {/* Animated Gradient Background */}
              {activeTrack === track.id && (
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", track.color)} />
              )}
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12",
                    activeTrack === track.id ? "bg-black/10" : "bg-gray-50"
                  )}>
                    <track.icon className={cn(
                      "w-7 h-7",
                      activeTrack === track.id ? "text-black" : "text-black"
                    )} />
                  </div>
                  <div>
                    <h4 className={cn(
                      "text-sm font-black uppercase tracking-tight",
                      activeTrack === track.id ? "text-black" : "text-black"
                    )}>{track.title}</h4>
                    <p className={cn(
                      "text-[9px] font-black uppercase tracking-widest",
                      activeTrack === track.id ? "text-black/50" : "text-gray-400"
                    )}>{track.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={cn(
                    "text-[10px] font-mono",
                    activeTrack === track.id ? "text-black/30" : "text-gray-300"
                  )}>{track.duration}</span>
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    activeTrack === track.id ? "bg-white/40 text-white" : "bg-ayur-neon/10 text-black"
                  )}>
                    {activeTrack === track.id && isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : activeTrack === track.id && isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current translate-x-0.5" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Player Controls */}
              <AnimatePresence>
                {activeTrack === track.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative z-10 pt-6 mt-6 border-t border-white/20 space-y-4"
                  >
                    <p className="text-[10px] text-white/80 font-medium leading-relaxed italic">
                      "{track.description}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white" 
                          animate={{ width: isPlaying ? '100%' : '0%' }}
                          transition={isPlaying ? { duration: 600, ease: "linear" } : { duration: 0 }}
                        />
                      </div>
                      <Volume2 className="w-3 h-3 text-white/60" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
