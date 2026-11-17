import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Image as ImageIcon, Bell, Settings, X, ShieldCheck, Mic } from 'lucide-react';
import { cn } from '../lib/utils';

interface PermissionModalProps {
  isOpen: boolean;
  type: 'camera' | 'gallery' | 'notifications' | 'microphone';
  onClose: () => void;
  onAllow: () => void;
  isPermanentlyDenied?: boolean;
  isDenied?: boolean;
}

const permissionConfig = {
  camera: {
    title: 'Camera Access Needed',
    message: 'We need access to your camera to analyze your condition using AI. This helps us provide accurate Ayurvedic insights.',
    icon: Camera,
    color: 'bg-blue-500',
  },
  gallery: {
    title: 'Photos Access Needed',
    message: 'We need access to your photos to upload and analyze your image for a personalized health assessment.',
    icon: ImageIcon,
    color: 'bg-purple-500',
  },
  notifications: {
    title: 'Enable Notifications',
    message: 'Enable notifications to get daily Ayurvedic tips, routine reminders, and personalized health alerts.',
    icon: Bell,
    color: 'bg-[#22C55E]',
  },
  microphone: {
    title: 'Microphone Access',
    message: 'We need access to your microphone to record your voice notes for a more detailed AI health analysis.',
    icon: Mic,
    color: 'bg-rose-500',
  },
};

export default function PermissionModal({ isOpen, type, onClose, onAllow, isPermanentlyDenied, isDenied }: PermissionModalProps) {
  const config = permissionConfig[type];
  const Icon = config.icon;

  const getTitle = () => {
    if (isPermanentlyDenied) return 'Permission Required';
    if (isDenied) return 'Permission Required';
    return config.title;
  };

  const getMessage = () => {
    if (isPermanentlyDenied) return `Please enable ${type} permission from your device settings to use this feature.`;
    if (isDenied) return `Permission required to use this feature. Please try again or enable it in settings.`;
    return config.message;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#0A0A0A] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto",
                isPermanentlyDenied || isDenied ? "bg-rose-500" : config.color
              )}>
                <Icon className="w-8 h-8 text-black" />
              </div>

              <h3 className="text-2xl font-black text-white text-center mb-3">
                {getTitle()}
              </h3>
              
              <p className="text-gray-400 text-center leading-relaxed mb-8">
                {getMessage()}
              </p>

              <div className="space-y-3">
                <button
                  onClick={onAllow}
                  className={cn(
                    "w-full py-4 rounded-2xl font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                    isPermanentlyDenied ? "bg-white text-black" : "bg-[#22C55E] text-black"
                  )}
                >
                  {isPermanentlyDenied ? (
                    <>
                      <Settings className="w-5 h-5" />
                      Open Settings
                    </>
                  ) : isDenied ? (
                    'Try Again'
                  ) : (
                    'Allow Access'
                  )}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-bold text-gray-500 hover:text-white transition-colors"
                >
                  {isPermanentlyDenied || isDenied ? 'Cancel' : 'Not Now'}
                </button>
              </div>
            </div>

            <div className="bg-white/5 p-4 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Secure & Private Access</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
