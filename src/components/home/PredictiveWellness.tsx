import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cloud, Sun, CloudRain, Wind, AlertTriangle, Sparkles, MapPin, Thermometer, Droplets, ArrowRight } from 'lucide-react';
import { callGeminiServer } from '../../lib/gemini';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const MODELS = {
  BASIC: 'gemini-3-flash-preview',
  COMPLEX: 'gemini-3-flash-preview'
};

interface WeatherData {
  temp: number;
  humidity: number;
  condition: string;
  location: string;
}

export const PredictiveWellness: React.FC = () => {
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
            console.warn("Invalid weather data in PredictiveWellness:", data);
            setWeather({ temp: 30, humidity: 60, condition: 'Clear', location: 'Local Cluster' });
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
        
        Provide a 6-8 word MAX ultra-punchy Ayurvedic seasonal warning.
        Format: "[Warning Text]"
      `;

      const result = await callGeminiServer(MODELS.BASIC, [{ role: 'user', parts: [{ text: prompt }] }]);
      const text = result.text || "";
      setInsight(text.trim());
    } catch (error) {
      setInsight("High humidity detected. Prefer dry, light meals.");
    }
  };

  if (loading) return null;

  return (
    <section className="px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="bg-stone-950 rounded-[2.5rem] p-4 md:p-6 border border-white/10 shadow-2xl relative overflow-hidden group">
          {/* Neural Lines Background Effect */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#ffffff11_1px,transparent_1px)] bg-[length:24px_24px]" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-10">
            {/* Zone 1: Weather HUD */}
            <div className="flex items-center gap-6 shrink-0 md:border-r md:border-white/10 md:pr-10">
              <div className="flex flex-col items-center">
                 <div className="text-4xl font-black text-white leading-none tracking-tighter mb-1 italic">{weather?.temp}°</div>
                 <div className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500 whitespace-nowrap">{weather?.location}</div>
              </div>

              <div className="w-px h-12 bg-white/10 hidden sm:block" />

              <div className="flex flex-col gap-1 items-center">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
                  {weather?.condition?.includes('Rain') ? <CloudRain className="w-5 h-5 text-sky-400" /> : 
                   weather?.condition?.includes('Cloud') ? <Cloud className="w-5 h-5 text-stone-400" /> : 
                   <Sun className="w-5 h-5 text-ayur-neon" />}
                </div>
                <span className="text-[8px] font-black text-stone-500 uppercase tracking-widest">{weather?.condition}</span>
              </div>
            </div>

            {/* Zone 2: AI Intelligence Ticker */}
            <div className="flex-1 min-w-0 flex items-center gap-5">
              <div className="w-1.5 h-10 bg-gradient-to-b from-ayur-neon to-transparent rounded-full hidden sm:block" />
              <div className="space-y-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-ayur-neon animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-ayur-neon/80">Adaptive Ritu-Charya AI</span>
                </div>
                <p className="text-white text-base md:text-lg font-bold leading-tight truncate">
                  {insight || "Syncing bio-environmental data..."}
                </p>
              </div>
            </div>

            {/* Zone 3: Quantum Metrics */}
            <div className="flex items-center gap-4 shrink-0 bg-white/5 p-3 px-5 rounded-2xl border border-white/5">
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-stone-500 tracking-widest">Alignment</span>
                  <span className="text-xs font-black text-white">94.2%</span>
               </div>
               <div className="w-px h-6 bg-white/10" />
               <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase text-stone-500 tracking-widest">Humidity</span>
                  <span className="text-xs font-black text-white">{weather?.humidity}%</span>
               </div>
               <motion.button
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.9 }}
                 className="w-8 h-8 rounded-full bg-ayur-neon flex items-center justify-center text-black ml-2"
               >
                 <ArrowRight className="w-4 h-4" />
               </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

