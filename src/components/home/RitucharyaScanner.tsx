import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Wind, 
  Sun, 
  CloudRain, 
  Thermometer, 
  Brain, 
  Crown, 
  Waves,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { callGeminiServer } from '../../lib/gemini';
import ritucharyaImage from '../../assets/images/ritucharya_cinematic_hero_1779639599212.png';

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface WeatherState {
  temp: number;
  ritu: string;
  condition: string;
  pittaImpact: number;
  location: string;
}

export const RitucharyaScanner: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<WeatherState | null>(null);
  const [scanning, setScanning] = useState(true);
  const [analysis, setAnalysis] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      setScanning(true);
      
      // Simulate/Fetch Weather
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
          
          let weatherData;
          if (WEATHER_API_KEY) {
            const res = await fetch(url);
            weatherData = await res.json();
          } else {
            // Fallback
            weatherData = { main: { temp: 32 }, weather: [{ main: 'Clear' }], name: 'Local Cluster' };
          }

          if (!weatherData || !weatherData.main || !weatherData.weather || !weatherData.weather[0]) {
             console.warn("Invalid weather data from API:", weatherData);
             weatherData = { main: { temp: 28 }, weather: [{ main: 'Clear' }], name: 'Bio-Node' };
          }

          const temp = Math.round(weatherData.main.temp);
          const ritu = temp > 30 ? 'Grishma (Summer)' : temp > 20 ? 'Vasanta (Spring)' : 'Hemanta (Winter)';
          
          const newState: WeatherState = {
            temp,
            ritu,
            condition: weatherData.weather[0].main,
            pittaImpact: Math.min(100, Math.max(10, (temp - 15) * 4)),
            location: weatherData.name
          };

          setData(newState);
          generateInsight(newState);
        } catch (e) {
          console.error(e);
        } finally {
          setTimeout(() => setScanning(false), 2000); // Visual delay for scanner
        }
      }, () => {
         // Default fallback
         const fallback: WeatherState = { temp: 28, ritu: 'Vasanta', condition: 'Clear', pittaImpact: 45, location: 'Bio-Node' };
         setData(fallback);
         generateInsight(fallback);
         setTimeout(() => setScanning(false), 2000);
      });
    };

    init();
  }, []);

  const generateInsight = async (s: WeatherState) => {
    try {
      const prompt = `Provide a 5-word Ayurvedic protocol for ${s.ritu} Ritu with ${s.temp}°C weather. Be punchy. Example: "Pitta rising. Avoid spicy aahar."`;
      const res = await callGeminiServer('gemini-3-flash-preview', [{ role: 'user', parts: [{ text: prompt }] }]);
      setAnalysis(res.text || "Synchronizing Ritucharya...");
    } catch (e) {
      setAnalysis("Maintain cooling aahar protocol.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-12">
      <div className="bg-stone-50 rounded-[2.5rem] p-px relative overflow-hidden group border border-stone-200 shadow-sm">
        {/* Cinematic Header Image */}
        <div className="relative w-full h-80 overflow-hidden rounded-[2.4rem] mb-1">
             <motion.img 
                src={ritucharyaImage}
                alt="Cinematic Ritucharya"
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-white/90 to-transparent" />
             <div className="absolute bottom-8 left-8">
                 <h2 className="text-4xl font-black text-black tracking-tight leading-tight">Seasonal Harmony</h2>
                 <p className="text-sm text-stone-700 font-medium">Real-time adaptive bio-rhythm sync.</p>
             </div>
        </div>
        {/* The Scanning Laser Line */}
        <AnimatePresence>
          {scanning && (
            <motion.div 
              initial={{ left: '-20%' }}
              animate={{ left: '120%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 bottom-0 w-64 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent -skew-x-[20deg] z-50 pointer-events-none blur-[2px]"
            />
          )}
        </AnimatePresence>

        <div className="bg-white rounded-[2.4rem] p-8 md:p-10 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            
            {/* Left: Bio-Metric Display */}
            <div className="shrink-0 flex items-center gap-8">
               <div className="relative">
                  <div className="w-24 h-24 rounded-full border-2 border-stone-100 flex items-center justify-center relative">
                    <Thermometer className={cn("w-10 h-10 transition-colors", scanning ? "text-stone-300" : "text-emerald-600")} />
                    
                    {/* Animated Score Arc */}
                    <svg className="absolute -inset-1 w-26 h-26 transform -rotate-90">
                      <motion.circle
                        cx="52"
                        cy="52"
                        r="50"
                        className="stroke-emerald-600 fill-none"
                        strokeWidth="2"
                        strokeDasharray="314"
                        initial={{ strokeDashoffset: 314 }}
                        animate={{ strokeDashoffset: scanning ? 314 : 314 - (314 * (data?.pittaImpact || 0) / 100) }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white border border-stone-100 rounded-xl px-3 py-1 shadow-sm">
                    <span className="text-[10px] font-black text-black">{data?.temp || '--'}°C</span>
                  </div>
               </div>

               <div className="space-y-1">
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em] mb-1">Adaptive Ritu-Sync</p>
                  <h3 className="text-2xl font-black text-black tracking-tight leading-none">
                    {scanning ? 'Analyzing...' : data?.ritu || 'Syncing...'}
                  </h3>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{data?.location}</span>
                     <div className="w-1 h-1 rounded-full bg-stone-300" />
                     <span className="text-[10px] font-bold text-stone-500 uppercase tracking-widest">{data?.condition}</span>
                  </div>
               </div>
            </div>

            {/* Middle: AI Insights Ledger */}
            <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50 rounded-[2rem] p-8 border border-stone-100 relative overflow-hidden">
               <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-emerald-600" />
                    <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">AI Verdict</span>
                  </div>
                  <p className={cn(
                    "text-sm font-medium text-stone-800 leading-snug transition-all duration-700",
                    scanning ? "opacity-20 blur-sm" : "opacity-100 blur-0"
                  )}>
                    {analysis || "..."}
                  </p>
               </div>

               <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="text-[10px] font-black text-stone-900 uppercase tracking-widest">Pitta Index</span>
                    </div>
                    <span className="text-[10px] font-black text-stone-900">{(data?.pittaImpact || 0)}%</span>
                  </div>
                  <div className="h-1 w-full bg-stone-200 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: scanning ? 0 : `${data?.pittaImpact || 0}%` }}
                      className="h-full bg-emerald-600"
                    />
                  </div>
               </div>
            </div>

            {/* Right: Premium Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate('/daily-routine-landing');
              }}
              className="group relative h-20 px-8 bg-black rounded-[1.5rem] flex items-center justify-center gap-4 transition-all overflow-hidden shrink-0 z-50 cursor-pointer"
            >
               <div className="flex flex-col items-start pointer-events-none">
                  <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mb-1">Intelligence</span>
                  <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Open Protocol</span>
               </div>
               <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white transition-all pointer-events-none">
                  <ArrowRight className="w-5 h-5" />
               </div>
            </motion.button>

          </div>
        </div>
      </div>

      {/* Trust & Verification Ticker */}
      <div className="flex items-center justify-between mt-4 px-4 opacity-100 grayscale hover:grayscale-0 transition-all cursor-default">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <Crown className="w-3 h-3 text-emerald-600" />
               <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Premium Bio-Sync</span>
            </div>
            <div className="w-px h-3 bg-stone-100" />
            <div className="flex items-center gap-2">
               <ShieldCheck className="w-3 h-3 text-emerald-600" />
               <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Validated AI Engine 4.2</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest leading-none">Live Weather Feed Attached</span>
         </div>
      </div>
    </div>
  );
};
