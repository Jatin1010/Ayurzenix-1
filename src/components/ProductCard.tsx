import { motion } from 'motion/react';
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product?: any;
  variant?: string;
  title?: string;
  price?: string;
  image?: string;
  rating?: number;
}

export default function ProductCard({ product, variant, title, price, image, rating }: ProductCardProps) {
  // Fallback to product properties if provided
  const displayTitle = title || product?.name || 'Ayurvedic Supplement';
  const displayPrice = price || product?.priceRange || '₹499';
  const displayImage = image || (product?.name ? `https://picsum.photos/seed/${encodeURIComponent(product.name)}/400/400` : 'https://images.unsplash.com/photo-1611073100862-234208006e89?q=80&w=600&auto=format&fit=crop');
  const displayRating = rating || 5;

  const queryName = product?.name || displayTitle;
  const affiliateUrl = `https://www.amazon.in/s?k=${encodeURIComponent(queryName)}&tag=goldify00-21`;

  return (
    <a 
      href={affiliateUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block text-inherit no-underline"
    >
      <motion.div 
        whileHover={{ y: -5 }}
        className={cn(
          "bg-white border shadow-sm group cursor-pointer transition-all h-full",
          variant === 'store' ? "rounded-[2rem] p-4 border-gray-100" : "rounded-[2.5rem] p-6 border-gray-100 shadow-xl"
        )}
      >
        <div className={cn(
          "relative overflow-hidden mb-6",
          variant === 'store' ? "rounded-[1.5rem] aspect-[4/5]" : "rounded-[2rem] aspect-square"
        )}>
          <img 
            src={displayImage} 
            alt={displayTitle} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          {(product?.isPopular || !variant) && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-black uppercase border border-black/5">
              {product?.isPopular ? 'Popular' : 'Verified'}
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < displayRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <h4 className={cn(
            "font-black text-black leading-tight uppercase line-clamp-2",
            variant === 'store' ? "text-sm" : "text-lg"
          )}>{displayTitle}</h4>
          <div className="flex items-center justify-between">
            <span className={cn(
              "font-black text-emerald-600",
              variant === 'store' ? "text-base" : "text-xl"
            )}>{displayPrice}</span>
            <div className={cn(
              "rounded-full bg-black text-white flex items-center justify-center transition-transform group-hover:rotate-12",
              variant === 'store' ? "w-8 h-8" : "w-10 h-10"
            )}>
              <ShoppingBag className={variant === 'store' ? "w-3 h-3" : "w-4 h-4"} />
            </div>
          </div>
        </div>
      </motion.div>
    </a>
  );
}
