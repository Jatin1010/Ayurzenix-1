import React, { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdUnitProps {
  className?: string;
}

export const AdUnit: React.FC<AdUnitProps> = ({ className }) => {
  const adRef = React.useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!adRef.current) return;

    let observer: ResizeObserver | null = null;
    let initialized = false;

    const tryInit = () => {
      if (initialized || !adRef.current) return;
      
      const el = adRef.current;
      const parent = el.parentElement;
      
      if (!parent) return;

      // AdSense typically needs at least 250px for responsive ads to not throw "No slot size"
      // Also ensure the element is actually "visible" in terms of layout
      const rect = el.getBoundingClientRect();
      const parentWidth = parent.offsetWidth;

      if (parentWidth >= 250 && rect.width >= 0) { 
        try {
          if (!el.getAttribute('data-adsbygoogle-status') && !el.getAttribute('data-ad-status')) {
            // Final check: is it in a hidden container?
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden') return;

            initialized = true;
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            if (observer) observer.disconnect();
          }
        } catch (e) {
          // Special handling for the common "No slot size" error to prevent console spam
          if (e instanceof Error && e.message.includes('No slot size')) {
            return;
          }
          console.error('AdSense Error initiation:', e);
        }
      }
    };

    // Use ResizeObserver to detect when the container actually has width
    if (adRef.current.parentElement) {
      observer = new ResizeObserver(() => {
        tryInit();
      });
      observer.observe(adRef.current.parentElement);
    }

    // Initial check
    tryInit();

    return () => {
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className={`ad-container my-8 overflow-hidden flex justify-center min-h-[100px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-2891634924200097"
        data-ad-slot="6338268633"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};
