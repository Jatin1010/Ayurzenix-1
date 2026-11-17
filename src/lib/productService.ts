const PEXELS_API_KEY = (import.meta as any).env.VITE_PEXELS_API_KEY;

const IMAGE_QUERY_MAPPING: Record<string, string> = {
  'Ashwagandha': 'ashwagandha root',
  'Shilajit': 'shilajit resin',
  'Neem': 'neem leaves',
  'Aloe Vera': 'aloe vera gel',
  'Triphala': 'ayurvedic powder',
  'Sea Buckthorn': 'sea buckthorn berries',
  'Giloy': 'giloy stem',
  'Turmeric': 'turmeric root',
  'Brahmi': 'brahmi plant',
  'Shatavari': 'shatavari root',
  'Amla': 'amla fruit',
  'Tulsi': 'holy basil leaves',
  'Guggul': 'guggul resin',
  'Mulethi': 'licorice root',
  'Safed Musli': 'safed musli root',
  'Arjuna': 'arjuna bark',
  'Manjistha': 'manjistha root',
  'Punarnava': 'punarnava plant',
  'Gokshura': 'gokshura fruit',
  'Karela': 'bitter gourd',
  'Jamun': 'black plum',
  'Fenugreek': 'fenugreek seeds',
  'Moringa': 'moringa leaves',
  'Wheatgrass': 'wheatgrass juice',
  'Spirulina': 'spirulina powder',
  'Chlorella': 'chlorella algae',
  'Curcumin': 'turmeric extract',
  'Ginger': 'ginger root',
  'Garlic': 'garlic bulb',
  'Cinnamon': 'cinnamon sticks',
  'Cardamom': 'cardamom pods',
  'Ashoka': 'ashoka bark',
  'Lodhra': 'lodhra bark',
  'Dashmool': 'ayurvedic herbs',
  'Chyawanprash': 'ayurvedic jam',
  'Honey': 'pure honey',
  'Ghee': 'clarified butter',
  'Coconut Oil': 'coconut oil',
  'Castor Oil': 'castor oil',
  'Almond Oil': 'almond oil',
  'Sesame Oil': 'sesame oil',
  'Rose Water': 'rose water',
  'Saffron': 'saffron strands',
  'Sandalwood': 'sandalwood powder',
  'Multani Mitti': 'fullers earth',
  'Reetha': 'soapnut',
  'Shikakai': 'shikakai pods',
  'Henna': 'henna powder',
  'Indigo': 'indigo powder',
  'Hibiscus': 'hibiscus flower',
  'Tongue Scraper': 'copper tongue scraper',
  'Copper Bottle': 'copper water bottle'
};

const imageCache: Record<string, string> = {};

export async function getProductImage(productName: string): Promise<string> {
  const baseQuery = IMAGE_QUERY_MAPPING[productName] || productName;
  // Append "ayurvedic herbal" to ensure we get medicinal/natural visuals
  const query = `${baseQuery} ayurvedic herbal`;
  
  if (imageCache[query]) {
    return imageCache[query];
  }

  if (!PEXELS_API_KEY) {
    return `https://picsum.photos/seed/${encodeURIComponent(baseQuery)}/400/400`;
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY
      }
    });
    const data = await response.json();
    const imageUrl = data.photos?.[0]?.src?.medium || `https://picsum.photos/seed/${encodeURIComponent(baseQuery)}/400/400`;
    imageCache[query] = imageUrl;
    return imageUrl;
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return `https://picsum.photos/seed/${encodeURIComponent(baseQuery)}/400/400`;
  }
}

export interface Product {
  id: string;
  name: string;
  benefit: string;
  priceRange: string;
  category: string;
  isPopular?: boolean;
  isTrending?: boolean;
  bodyType?: string[];
  concern?: 'stress' | 'skin' | 'energy' | 'digestion' | 'hair' | 'heart';
  hinglishVerdict?: string;
  stockCount?: number;
}

export const PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Ashwagandha', 
    benefit: 'Stress relief & energy booster', 
    priceRange: '₹399 – ₹799', 
    category: 'Daily Wellness', 
    isPopular: true, 
    bodyType: ['Vata', 'Kapha'],
    concern: 'stress',
    hinglishVerdict: 'Stress kam karne aur energy badhane ke liye best hai. Bilkul safe aur effective.',
    stockCount: 5
  },
  { 
    id: '2', 
    name: 'Shilajit', 
    benefit: 'Strength & stamina enhancer', 
    priceRange: '₹999 – ₹1599', 
    category: 'Trending Now', 
    isPopular: true, 
    bodyType: ['Vata', 'Kapha'],
    concern: 'energy',
    hinglishVerdict: 'Pure Himalayan quality jo apka stamina double kar dega. Har mard ke liye zaroori.',
    stockCount: 3
  },
  { 
    id: '3', 
    name: 'Triphala', 
    benefit: 'Digestive health & detox', 
    priceRange: '₹249 – ₹499', 
    category: 'Daily Wellness', 
    bodyType: ['Vata', 'Pitta', 'Kapha'],
    concern: 'digestion',
    hinglishVerdict: 'Pet saaf toh tan-man saaf. Natural detox ke liye isse accha kuch nahi.',
    stockCount: 12
  },
  { 
    id: '4', 
    name: 'Brahmi', 
    benefit: 'Memory & focus support', 
    priceRange: '₹349 – ₹649', 
    category: 'Daily Wellness', 
    bodyType: ['Pitta'],
    concern: 'stress',
    hinglishVerdict: 'Dimag ko sharp aur memory ko tez karta hai. Students ke liye super hit!',
    stockCount: 8
  },
  { 
    id: '5', 
    name: 'Shatavari', 
    benefit: 'Hormonal balance for women', 
    priceRange: '₹449 – ₹849', 
    category: 'Daily Wellness', 
    bodyType: ['Pitta'],
    concern: 'energy',
    hinglishVerdict: 'Women health ke liye ancient secret. Balance aur health dono ek sath.',
    stockCount: 6
  },
  { 
    id: '6', 
    name: 'Amla', 
    benefit: 'Vitamin C & immunity boost', 
    priceRange: '₹199 – ₹399', 
    category: 'Daily Wellness', 
    isTrending: true, 
    bodyType: ['Pitta'],
    concern: 'energy',
    hinglishVerdict: 'Immunity booster jo skin aur hair bhi chamka deta hai. Sasta aur badhiya.',
    stockCount: 20
  },
  { 
    id: '11', 
    name: 'Turmeric', 
    benefit: 'Anti-inflammatory & skin health', 
    priceRange: '₹199 – ₹499', 
    category: 'Daily Wellness', 
    isPopular: true, 
    bodyType: ['Kapha'],
    concern: 'skin',
    hinglishVerdict: 'Andar ki safai aur bahaar ka glow. Har ghar ki Shaan!',
    stockCount: 15
  },
  { 
    id: '12', 
    name: 'Neem', 
    benefit: 'Blood purifier & skin detox', 
    priceRange: '₹149 – ₹349', 
    category: 'Daily Wellness', 
    bodyType: ['Pitta', 'Kapha'],
    concern: 'skin',
    hinglishVerdict: 'Skin problems ka paka solution. Blood saaf kare aur daag door kare.',
    stockCount: 4
  },
  { 
    id: '14', 
    name: 'Sea Buckthorn', 
    benefit: 'Omega-7 & skin rejuvenation', 
    priceRange: '₹599 – ₹999', 
    category: 'Trending Now', 
    isTrending: true, 
    bodyType: ['Vata'],
    concern: 'skin',
    hinglishVerdict: 'Modern science aur Ayurveda ka perfect blend. Skin rejuvenation ke liye best.',
    stockCount: 2
  },
  { 
    id: '30', 
    name: 'Henna', 
    benefit: 'Natural hair color & cooling', 
    priceRange: '₹99 – ₹249', 
    category: 'Daily Wellness', 
    bodyType: ['Pitta'],
    concern: 'hair',
    hinglishVerdict: 'Natural hair color aur scalp cooling ke liye best choice.',
    stockCount: 9
  },
  { 
    id: '31', 
    name: 'Tongue Scraper', 
    benefit: 'Oral detox & bacteria removal', 
    priceRange: '₹149 – ₹299', 
    category: 'Daily Wellness', 
    bodyType: ['Vata', 'Pitta', 'Kapha'],
    concern: 'digestion',
    hinglishVerdict: 'Pure copper cleaner jo toxins hataye aur swasthya sudhare. Din ki sahi shuruwat!',
    stockCount: 30
  },
  { 
    id: '32', 
    name: 'Copper Bottle', 
    benefit: 'Water ionization & ionization', 
    priceRange: '₹599 – ₹999', 
    category: 'Daily Wellness', 
    bodyType: ['Vata', 'Pitta', 'Kapha'],
    concern: 'digestion',
    isTrending: true,
    hinglishVerdict: 'Tamre Jal (copper water) peeine se pachan aur metabolism sudharta hai.',
    stockCount: 15
  }
];

export function getAmazonLink(productName: string): string {
  return `https://www.amazon.in/s?k=${encodeURIComponent(productName)}&tag=goldify00-21`;
}
