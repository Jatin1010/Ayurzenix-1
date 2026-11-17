import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Sun, CloudRain, Zap, Brain, ShieldCheck, Thermometer } from 'lucide-react';
import { callGeminiServer } from '../../lib/gemini';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  location: string;
}

export const VedaIntelligenceHUD: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [insight, setInsight] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          
          if (!API_KEY) {
             setWeather({ temp: 32, humidity: 65, condition: 'Clear', location: 'Mumbai' });
             return;
          }

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await response.json();
          
          if (data.main && data.weather && data.weather[0]) {
            setWeather({
              temp: Math.round(data.main.temp),
              humidity: data.main.humidity,
              condition: data.weather[0].main,
              location: data.name
            });
          } else {
            console.warn("Invalid weather data received:", data);
            setWeather({ temp: 28, humidity: 70, condition: 'Cloudy', location: 'Bengaluru' });
          }
        }, () => {
          setWeather({ temp: 28, humidity: 70, condition: 'Cloudy', location: 'Bengaluru' });
        });
      } catch (error) {
        console.error("Weather error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  useEffect(() => {
    if (weather) {
      generateAIInsight(weather);
    }
  }, [weather]);

  const generateAIInsight = async (data: WeatherData) => {
    try {
      const prompt = `
        You are an expert Ayurvedic Ritu-Charya consultant. 
        Current Weather: ${data.temp}°C, Humidity ${data.humidity}%, Condition: ${data.condition}. 
        
        Provide a 4-6 word MAX ultra-punchy Ayurvedic seasonal warning or protocol.
        Format: "[Warning Text]"
      `;

      const result = await callGeminiServer('gemini-3-flash-preview', [{ role: 'user', parts: [{ text: prompt }] }]);
      const text = result.text || "";
      setInsight(text.trim());
    } catch (error) {
      setInsight("Hydration Protocol Active.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 mb-8 mt-[-2rem] relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-2xl rounded-full p-2 pl-4 pr-6 border border-black/[0.03] shadow-premium flex items-center justify-between gap-4 overflow-hidden group"
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Weather Pill */}
          <div className="flex items-center gap-3 bg-stone-50 rounded-full px-4 py-2 border border-black/[0.02]">
            <div className="text-sm font-black text-black">{weather?.temp || 28}°</div>
            <div className="w-px h-3 bg-black/5" />
            <div className="flex items-center gap-1.5 text-stone-400">
               {weather?.condition?.includes('Rain') ? <CloudRain className="w-3.5 h-3.5" /> : 
                weather?.condition?.includes('Cloud') ? <Cloud className="w-3.5 h-3.5" /> : 
                <Sun className="w-3.5 h-3.5 text-orange-400" />}
               <span className="text-[10px] font-black uppercase tracking-widest">{weather?.condition || 'Clear'}</span>
            </div>
          </div>

          <div className="w-px h-6 bg-black/5" />

          {/* AI Intelligence Ticker */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
             <div className="flex items-center gap-1.5 shrink-0">
                <Brain className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 hidden sm:inline">AI Pulsar:</span>
             </div>
             <motion.p 
               key={insight}
               initial={{ opacity: 0, x: -10 }}
               animate={{ opacity: 1, x: 0 }}
               className="text-xs font-bold text-black truncate"
             >
               {insight || "Synchronizing Veda Intelligence..."}
             </motion.p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-3">
             <div className="flex flex-col items-end">
                <span className="text-[8px] font-black text-stone-400 uppercase tracking-widest">Alignment</span>
                <span className="text-[10px] font-[1000] text-emerald-600 tracking-tighter">94%</span>
             </div>
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg">
             <ShieldCheck className="w-4 h-4" />
          </button>
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </motion.div>
    </div>
  );
};
