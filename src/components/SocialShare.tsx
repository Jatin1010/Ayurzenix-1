import { Share2, Facebook, Instagram, Clipboard } from 'lucide-react';
import { useState } from 'react';

export default function SocialShare({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-3xl border border-gray-100 space-y-4">
      <h4 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] text-center">Share this feature</h4>
      <div className="flex gap-4 justify-center">
        <button onClick={shareFacebook} className="p-4 bg-white border border-gray-200 rounded-full hover:bg-blue-50 transition-colors">
          <Facebook className="w-6 h-6 text-blue-600" />
        </button>
        <button onClick={handleCopy} className="p-4 bg-white border border-gray-200 rounded-full hover:bg-emerald-50 transition-colors relative">
          <Clipboard className="w-6 h-6 text-gray-700" />
          {copied && <span className="absolute -top-10 left-0 bg-black text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
        </button>
      </div>
    </div>
  );
}
