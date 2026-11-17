export interface Product {
  id: string;
  name: string;
  category: string;
  benefit: string;
  tag?: 'Best Seller' | 'Trending' | 'New' | 'Top Rated';
  price: string;
  image: string;
  dosha?: ('Vata' | 'Pitta' | 'Kapha')[];
}

export const CATEGORIES = [
  'All',
  'Immunity',
  'Digestion',
  'Skin & Hair',
  'Stress & Sleep',
  'Vitality',
  'Women\'s Health',
  'Men\'s Health',
  'Joints'
];

export const PRODUCTS: Product[] = [
  // Immunity
  {
    id: '1',
    name: 'Chyawanprash Special',
    category: 'Immunity',
    benefit: 'Boosts immunity and respiratory health',
    tag: 'Best Seller',
    price: '₹349',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=1000&h=1000',
    dosha: ['Vata', 'Pitta', 'Kapha']
  },
  {
    id: '2',
    name: 'Giloy Ghan Vati',
    category: 'Immunity',
    benefit: 'Natural immunity booster and fever relief',
    tag: 'Trending',
    price: '₹120',
    image: 'https://picsum.photos/seed/giloy/400/400',
    dosha: ['Pitta', 'Kapha']
  },
  {
    id: '3',
    name: 'Tulsi Drops',
    category: 'Immunity',
    benefit: 'Antioxidant and stress reliever',
    price: '₹195',
    image: 'https://picsum.photos/seed/tulsi/400/400',
    dosha: ['Kapha', 'Vata']
  },
  {
    id: '4',
    name: 'Ashwagandha Capsules',
    category: 'Vitality',
    benefit: 'Reduces stress and improves strength',
    tag: 'Best Seller',
    price: '₹450',
    image: 'https://images.unsplash.com/photo-1615485240384-552e40df19c1?auto=format&fit=crop&q=80&w=1000&h=1000',
    dosha: ['Vata', 'Kapha']
  },
  {
    id: '5',
    name: 'Amla Juice (Pure)',
    category: 'Immunity',
    benefit: 'Rich in Vitamin C and good for eyes',
    price: '₹280',
    image: 'https://picsum.photos/seed/amla/400/400',
    dosha: ['Pitta']
  },
  // Digestion
  {
    id: '6',
    name: 'Triphala Churna',
    category: 'Digestion',
    benefit: 'Natural colon cleanser and digestive aid',
    tag: 'Best Seller',
    price: '₹150',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=1000&h=1000',
    dosha: ['Vata', 'Pitta', 'Kapha']
  },
  {
    id: '7',
    name: 'Isabgol (Psyllium Husk)',
    category: 'Digestion',
    benefit: 'Relieves constipation and improves digestion',
    price: '₹220',
    image: 'https://picsum.photos/seed/isabgol/400/400',
    dosha: ['Vata']
  },
  {
    id: '8',
    name: 'Hingwashtak Churna',
    category: 'Digestion',
    benefit: 'Relieves gas and bloating',
    price: '₹110',
    image: 'https://picsum.photos/seed/hing/400/400',
    dosha: ['Vata', 'Kapha']
  },
  {
    id: '9',
    name: 'Avipattikar Churna',
    category: 'Digestion',
    benefit: 'Relieves acidity and heartburn',
    price: '₹140',
    image: 'https://picsum.photos/seed/acidity/400/400',
    dosha: ['Pitta']
  },
  {
    id: '10',
    name: 'Lavan Bhaskar Churna',
    category: 'Digestion',
    benefit: 'Improves appetite and digestion',
    price: '₹95',
    image: 'https://picsum.photos/seed/appetite/400/400',
    dosha: ['Kapha']
  },
  // Skin & Hair
  {
    id: '11',
    name: 'Kumkumadi Tailam',
    category: 'Skin & Hair',
    benefit: 'Brightens skin and reduces dark spots',
    tag: 'Trending',
    price: '₹850',
    image: 'https://picsum.photos/seed/kumkumadi/400/400',
    dosha: ['Vata', 'Pitta']
  },
  {
    id: '12',
    name: 'Bhringraj Hair Oil',
    category: 'Skin & Hair',
    benefit: 'Promotes hair growth and prevents greying',
    tag: 'Best Seller',
    price: '₹399',
    image: 'https://picsum.photos/seed/bhringraj/400/400',
    dosha: ['Pitta', 'Vata']
  },
  {
    id: '13',
    name: 'Neem Face Wash',
    category: 'Skin & Hair',
    benefit: 'Anti-acne and deep cleansing',
    price: '₹175',
    image: 'https://picsum.photos/seed/neem/400/400',
    dosha: ['Pitta', 'Kapha']
  },
  {
    id: '14',
    name: 'Aloe Vera Gel (Pure)',
    category: 'Skin & Hair',
    benefit: 'Soothes skin and hydrates hair',
    price: '₹210',
    image: 'https://picsum.photos/seed/aloe/400/400',
    dosha: ['Pitta']
  },
  {
    id: '15',
    name: 'Ubtan Face Mask',
    category: 'Skin & Hair',
    benefit: 'Natural tan removal and glow',
    price: '₹325',
    image: 'https://picsum.photos/seed/ubtan/400/400',
    dosha: ['Kapha', 'Vata']
  },
  // Stress & Sleep
  {
    id: '16',
    name: 'Brahmi Vati',
    category: 'Stress & Sleep',
    benefit: 'Improves memory and concentration',
    tag: 'Trending',
    price: '₹280',
    image: 'https://picsum.photos/seed/brahmi/400/400',
    dosha: ['Vata', 'Pitta']
  },
  {
    id: '17',
    name: 'Tagar (Valerian Root)',
    category: 'Stress & Sleep',
    benefit: 'Promotes deep and restful sleep',
    price: '₹350',
    image: 'https://picsum.photos/seed/sleep/400/400',
    dosha: ['Vata']
  },
  {
    id: '18',
    name: 'Jatamansi Powder',
    category: 'Stress & Sleep',
    benefit: 'Calms the mind and reduces anxiety',
    price: '₹240',
    image: 'https://picsum.photos/seed/calm/400/400',
    dosha: ['Vata', 'Pitta']
  },
  {
    id: '19',
    name: 'Shankhpushpi Syrup',
    category: 'Stress & Sleep',
    benefit: 'Brain tonic for all ages',
    price: '₹185',
    image: 'https://picsum.photos/seed/brain/400/400',
    dosha: ['Pitta', 'Kapha']
  },
  {
    id: '20',
    name: 'Stress Relief Tea',
    category: 'Stress & Sleep',
    benefit: 'Herbal blend for relaxation',
    price: '₹299',
    image: 'https://picsum.photos/seed/tea/400/400',
    dosha: ['Vata', 'Pitta', 'Kapha']
  },
  // Vitality
  {
    id: '21',
    name: 'Shilajit Resin (Pure)',
    category: 'Vitality',
    benefit: 'Natural stamina and energy booster',
    tag: 'Best Seller',
    price: '₹1250',
    image: 'https://images.unsplash.com/photo-1611244419377-b0a760c19719?auto=format&fit=crop&q=80&w=1000&h=1000',
    dosha: ['Kapha', 'Vata']
  },
  {
    id: '22',
    name: 'Safed Musli Capsules',
    category: 'Vitality',
    benefit: 'Improves vigor and vitality',
    price: '₹550',
    image: 'https://picsum.photos/seed/musli/400/400',
    dosha: ['Vata', 'Pitta']
  },
  {
    id: '23',
    name: 'Gokshura Tablets',
    category: 'Vitality',
    benefit: 'Supports kidney and urinary health',
    price: '₹210',
    image: 'https://picsum.photos/seed/gokshura/400/400',
    dosha: ['Pitta', 'Vata']
  },
  {
    id: '24',
    name: 'Shatavari Powder',
    category: 'Women\'s Health',
    benefit: 'Supports female hormonal balance',
    tag: 'Best Seller',
    price: '₹320',
    image: 'https://picsum.photos/seed/shatavari/400/400',
    dosha: ['Pitta', 'Vata']
  },
  {
    id: '25',
    name: 'Kaunch Beej Powder',
    category: 'Vitality',
    benefit: 'Natural source of L-Dopa',
    price: '₹275',
    image: 'https://picsum.photos/seed/kaunch/400/400',
    dosha: ['Vata']
  },
  // Joints
  {
    id: '26',
    name: 'Shallaki Tablets',
    category: 'Joints',
    benefit: 'Reduces joint pain and inflammation',
    tag: 'Trending',
    price: '₹245',
    image: 'https://picsum.photos/seed/shallaki/400/400',
    dosha: ['Vata', 'Kapha']
  },
  {
    id: '27',
    name: 'Mahanarayan Oil',
    category: 'Joints',
    benefit: 'Traditional oil for joint massage',
    price: '₹380',
    image: 'https://picsum.photos/seed/massage/400/400',
    dosha: ['Vata']
  },
  {
    id: '28',
    name: 'Yograj Guggulu',
    category: 'Joints',
    benefit: 'Supports joint mobility',
    price: '₹190',
    image: 'https://picsum.photos/seed/guggulu/400/400',
    dosha: ['Vata', 'Kapha']
  },
  {
    id: '29',
    name: 'Hadjo Tablets',
    category: 'Joints',
    benefit: 'Promotes bone healing and strength',
    price: '₹260',
    image: 'https://picsum.photos/seed/bone/400/400',
    dosha: ['Vata']
  },
  {
    id: '30',
    name: 'Pain Relief Balm',
    category: 'Joints',
    benefit: 'Instant relief from muscle aches',
    price: '₹125',
    image: 'https://picsum.photos/seed/balm/400/400',
    dosha: ['Vata', 'Kapha']
  },
  // Adding more to reach 100+
  { id: '31', name: 'Turmeric Curcumin', category: 'Immunity', benefit: 'Anti-inflammatory powerhouse', price: '₹499', image: 'https://images.unsplash.com/photo-1615485240384-552e40df19c1?auto=format&fit=crop&q=80&w=1000&h=1000', dosha: ['Kapha'] },
  { id: '32', name: 'Moringa Powder', category: 'Vitality', benefit: 'Superfood for energy', price: '₹350', image: 'https://picsum.photos/seed/moringa/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '33', name: 'Neem Tablets', category: 'Skin & Hair', benefit: 'Blood purifier', price: '₹180', image: 'https://picsum.photos/seed/neemtab/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '34', name: 'Karela Jamun Juice', category: 'Digestion', benefit: 'Supports healthy blood sugar', price: '₹320', image: 'https://picsum.photos/seed/karela/400/400', dosha: ['Kapha'] },
  { id: '35', name: 'Wheatgrass Powder', category: 'Vitality', benefit: 'Detox and energy', price: '₹450', image: 'https://picsum.photos/seed/wheatgrass/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '36', name: 'Triphala Guggulu', category: 'Digestion', benefit: 'Weight management support', price: '₹210', image: 'https://picsum.photos/seed/triphalagug/400/400', dosha: ['Kapha', 'Vata'] },
  { id: '37', name: 'Punarnava Vati', category: 'Vitality', benefit: 'Supports kidney health', price: '₹195', image: 'https://picsum.photos/seed/punarnava/400/400', dosha: ['Kapha', 'Pitta'] },
  { id: '38', name: 'Guduchi Tablets', category: 'Immunity', benefit: 'Immune modulator', price: '₹160', image: 'https://picsum.photos/seed/guduchi/400/400', dosha: ['Pitta', 'Vata', 'Kapha'] },
  { id: '39', name: 'Arjuna Tablets', category: 'Vitality', benefit: 'Supports heart health', price: '₹230', image: 'https://picsum.photos/seed/arjuna/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '40', name: 'Kanchanar Guggulu', category: 'Vitality', benefit: 'Supports thyroid health', price: '₹240', image: 'https://picsum.photos/seed/kanchanar/400/400', dosha: ['Kapha'] },
  { id: '41', name: 'Manjistha Powder', category: 'Skin & Hair', benefit: 'Lymphatic detox', price: '₹280', image: 'https://picsum.photos/seed/manjistha/400/400', dosha: ['Pitta'] },
  { id: '42', name: 'Haritaki Powder', category: 'Digestion', benefit: 'Gentle laxative', price: '₹160', image: 'https://picsum.photos/seed/haritaki/400/400', dosha: ['Vata'] },
  { id: '43', name: 'Bibhitaki Powder', category: 'Immunity', benefit: 'Respiratory support', price: '₹150', image: 'https://picsum.photos/seed/bibhitaki/400/400', dosha: ['Kapha'] },
  { id: '44', name: 'Licorice (Mulethi) Powder', category: 'Immunity', benefit: 'Soothes throat and stomach', price: '₹120', image: 'https://picsum.photos/seed/mulethi/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '45', name: 'Ginger (Sunthi) Powder', category: 'Digestion', benefit: 'Digestive fire booster', price: '₹90', image: 'https://picsum.photos/seed/ginger/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '46', name: 'Cardamom Capsules', category: 'Digestion', benefit: 'Fresh breath and digestion', price: '₹350', image: 'https://picsum.photos/seed/cardamom/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '47', name: 'Fennel (Saunf) Seeds', category: 'Digestion', benefit: 'Post-meal digestive', price: '₹80', image: 'https://picsum.photos/seed/fennel/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '48', name: 'Fenugreek (Methi) Tablets', category: 'Digestion', benefit: 'Blood sugar support', price: '₹210', image: 'https://picsum.photos/seed/methi/400/400', dosha: ['Kapha'] },
  { id: '49', name: 'Cinnamon Bark Powder', category: 'Digestion', benefit: 'Metabolism booster', price: '₹180', image: 'https://picsum.photos/seed/cinnamon/400/400', dosha: ['Kapha', 'Vata'] },
  { id: '50', name: 'Ghee (A2 Cow)', category: 'Vitality', benefit: 'Healthy fats and brain fuel', price: '₹1200', image: 'https://picsum.photos/seed/ghee/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '51', name: 'Honey (Wild Forest)', category: 'Immunity', benefit: 'Natural sweetener and healer', price: '₹450', image: 'https://picsum.photos/seed/honey/400/400', dosha: ['Kapha'] },
  { id: '52', name: 'Saffron (Kesar)', category: 'Vitality', benefit: 'Mood and skin enhancer', price: '₹350', image: 'https://picsum.photos/seed/saffron/400/400', dosha: ['Vata', 'Pitta', 'Kapha'] },
  { id: '53', name: 'Rose Water (Pure)', category: 'Skin & Hair', benefit: 'Natural toner and coolant', price: '₹150', image: 'https://picsum.photos/seed/rose/400/400', dosha: ['Pitta'] },
  { id: '54', name: 'Sandalwood Powder', category: 'Skin & Hair', benefit: 'Cooling face pack', price: '₹650', image: 'https://picsum.photos/seed/sandalwood/400/400', dosha: ['Pitta'] },
  { id: '55', name: 'Multani Mitti', category: 'Skin & Hair', benefit: 'Oil control face pack', price: '₹80', image: 'https://picsum.photos/seed/multani/400/400', dosha: ['Kapha'] },
  { id: '56', name: 'Shikakai Powder', category: 'Skin & Hair', benefit: 'Natural hair cleanser', price: '₹120', image: 'https://picsum.photos/seed/shikakai/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '57', name: 'Reetha (Soapnut) Powder', category: 'Skin & Hair', benefit: 'Natural shampoo', price: '₹110', image: 'https://picsum.photos/seed/reetha/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '58', name: 'Henna (Mehendi) Powder', category: 'Skin & Hair', benefit: 'Natural hair color and conditioner', price: '₹150', image: 'https://picsum.photos/seed/henna/400/400', dosha: ['Pitta'] },
  { id: '59', name: 'Indigo Powder', category: 'Skin & Hair', benefit: 'Natural black hair dye', price: '₹250', image: 'https://picsum.photos/seed/indigo/400/400', dosha: ['Pitta'] },
  { id: '60', name: 'Castor Oil (Cold Pressed)', category: 'Skin & Hair', benefit: 'Hair growth and skin hydration', price: '₹280', image: 'https://picsum.photos/seed/castor/400/400', dosha: ['Vata'] },
  { id: '61', name: 'Coconut Oil (Virgin)', category: 'Skin & Hair', benefit: 'Multi-purpose moisturizer', price: '₹350', image: 'https://picsum.photos/seed/coconut/400/400', dosha: ['Pitta'] },
  { id: '62', name: 'Sesame Oil (Black)', category: 'Vitality', benefit: 'Traditional massage oil', price: '₹420', image: 'https://picsum.photos/seed/sesame/400/400', dosha: ['Vata'] },
  { id: '63', name: 'Mustard Oil', category: 'Vitality', benefit: 'Warming massage oil', price: '₹220', image: 'https://picsum.photos/seed/mustard/400/400', dosha: ['Kapha'] },
  { id: '64', name: 'Almond Oil (Sweet)', category: 'Vitality', benefit: 'Brain and skin health', price: '₹550', image: 'https://picsum.photos/seed/almond/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '65', name: 'Walnut Oil', category: 'Vitality', benefit: 'Omega-3 rich oil', price: '₹750', image: 'https://picsum.photos/seed/walnut/400/400', dosha: ['Vata'] },
  { id: '66', name: 'Flaxseed Oil', category: 'Vitality', benefit: 'Plant-based Omega-3', price: '₹380', image: 'https://picsum.photos/seed/flax/400/400', dosha: ['Vata'] },
  { id: '67', name: 'Pumpkin Seed Oil', category: 'Men\'s Health', benefit: 'Prostate and hair health', price: '₹650', image: 'https://picsum.photos/seed/pumpkin/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '68', name: 'Black Seed (Kalonji) Oil', category: 'Immunity', benefit: 'Cure for everything but death', price: '₹480', image: 'https://picsum.photos/seed/kalonji/400/400', dosha: ['Vata', 'Pitta', 'Kapha'] },
  { id: '69', name: 'Eucalyptus Oil', category: 'Immunity', benefit: 'Respiratory relief', price: '₹150', image: 'https://picsum.photos/seed/eucalyptus/400/400', dosha: ['Kapha'] },
  { id: '70', name: 'Peppermint Oil', category: 'Digestion', benefit: 'Cooling and digestive', price: '₹180', image: 'https://picsum.photos/seed/peppermint/400/400', dosha: ['Pitta'] },
  { id: '71', name: 'Lavender Oil', category: 'Stress & Sleep', benefit: 'Relaxing aromatherapy', price: '₹250', image: 'https://picsum.photos/seed/lavender/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '72', name: 'Tea Tree Oil', category: 'Skin & Hair', benefit: 'Anti-fungal and anti-acne', price: '₹220', image: 'https://picsum.photos/seed/teatree/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '73', name: 'Lemon Oil', category: 'Immunity', benefit: 'Refreshing and detoxifying', price: '₹140', image: 'https://picsum.photos/seed/lemon/400/400', dosha: ['Kapha'] },
  { id: '74', name: 'Orange Oil', category: 'Stress & Sleep', benefit: 'Uplifting and calming', price: '₹130', image: 'https://picsum.photos/seed/orange/400/400', dosha: ['Vata'] },
  { id: '75', name: 'Frankincense Oil', category: 'Stress & Sleep', benefit: 'Spiritual and skin health', price: '₹850', image: 'https://picsum.photos/seed/frankincense/400/400', dosha: ['Vata', 'Pitta', 'Kapha'] },
  { id: '76', name: 'Myrrh Oil', category: 'Skin & Hair', benefit: 'Healing and anti-aging', price: '₹950', image: 'https://picsum.photos/seed/myrrh/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '77', name: 'Patchouli Oil', category: 'Skin & Hair', benefit: 'Earthy scent and skin health', price: '₹350', image: 'https://picsum.photos/seed/patchouli/400/400', dosha: ['Kapha'] },
  { id: '78', name: 'Ylang Ylang Oil', category: 'Stress & Sleep', benefit: 'Sensual and relaxing', price: '₹450', image: 'https://picsum.photos/seed/ylang/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '79', name: 'Geranium Oil', category: 'Women\'s Health', benefit: 'Hormonal balance and skin', price: '₹550', image: 'https://picsum.photos/seed/geranium/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '80', name: 'Clary Sage Oil', category: 'Women\'s Health', benefit: 'Menstrual relief and sleep', price: '₹650', image: 'https://picsum.photos/seed/clary/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '81', name: 'Rosemary Oil', category: 'Skin & Hair', benefit: 'Hair growth and memory', price: '₹320', image: 'https://picsum.photos/seed/rosemary/400/400', dosha: ['Kapha', 'Vata'] },
  { id: '82', name: 'Thyme Oil', category: 'Immunity', benefit: 'Strong anti-microbial', price: '₹280', image: 'https://picsum.photos/seed/thyme/400/400', dosha: ['Kapha'] },
  { id: '83', name: 'Oregano Oil', category: 'Immunity', benefit: 'Natural antibiotic', price: '₹850', image: 'https://picsum.photos/seed/oregano/400/400', dosha: ['Kapha'] },
  { id: '84', name: 'Basil Oil', category: 'Immunity', benefit: 'Respiratory and digestive', price: '₹190', image: 'https://picsum.photos/seed/basil/400/400', dosha: ['Kapha', 'Vata'] },
  { id: '85', name: 'Clove Oil', category: 'Joints', benefit: 'Toothache and joint pain', price: '₹120', image: 'https://picsum.photos/seed/clove/400/400', dosha: ['Kapha'] },
  { id: '86', name: 'Cinnamon Oil', category: 'Vitality', benefit: 'Warming and circulation', price: '₹160', image: 'https://picsum.photos/seed/cinnamonoil/400/400', dosha: ['Kapha', 'Vata'] },
  { id: '87', name: 'Black Pepper Oil', category: 'Vitality', benefit: 'Metabolism and pain', price: '₹210', image: 'https://picsum.photos/seed/pepper/400/400', dosha: ['Kapha'] },
  { id: '88', name: 'Turmeric Oil', category: 'Skin & Hair', benefit: 'Anti-inflammatory and glow', price: '₹350', image: 'https://picsum.photos/seed/turmericoil/400/400', dosha: ['Pitta', 'Kapha'] },
  { id: '89', name: 'Ginger Oil', category: 'Digestion', benefit: 'Warming and digestive', price: '₹240', image: 'https://picsum.photos/seed/gingeroil/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '90', name: 'Fennel Oil', category: 'Digestion', benefit: 'Digestive and hormonal', price: '₹180', image: 'https://picsum.photos/seed/fenneloil/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '91', name: 'Dill Oil', category: 'Digestion', benefit: 'Gentle digestive for kids', price: '₹150', image: 'https://picsum.photos/seed/dill/400/400', dosha: ['Vata', 'Pitta'] },
  { id: '92', name: 'Anise Oil', category: 'Digestion', benefit: 'Sweet digestive and respiratory', price: '₹140', image: 'https://picsum.photos/seed/anise/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '93', name: 'Star Anise Oil', category: 'Immunity', benefit: 'Anti-viral and digestive', price: '₹280', image: 'https://picsum.photos/seed/staranise/400/400', dosha: ['Kapha'] },
  { id: '94', name: 'Juniper Berry Oil', category: 'Vitality', benefit: 'Detox and urinary health', price: '₹450', image: 'https://picsum.photos/seed/juniper/400/400', dosha: ['Kapha'] },
  { id: '95', name: 'Cypress Oil', category: 'Vitality', benefit: 'Circulation and grounding', price: '₹380', image: 'https://picsum.photos/seed/cypress/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '96', name: 'Cedarwood Oil', category: 'Stress & Sleep', benefit: 'Grounding and skin health', price: '₹220', image: 'https://picsum.photos/seed/cedarwood/400/400', dosha: ['Vata'] },
  { id: '97', name: 'Pine Oil', category: 'Immunity', benefit: 'Respiratory and refreshing', price: '₹180', image: 'https://picsum.photos/seed/pine/400/400', dosha: ['Kapha'] },
  { id: '98', name: 'Spruce Oil', category: 'Immunity', benefit: 'Vitality and respiratory', price: '₹350', image: 'https://picsum.photos/seed/spruce/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '99', name: 'Fir Oil', category: 'Immunity', benefit: 'Grounding and respiratory', price: '₹280', image: 'https://picsum.photos/seed/fir/400/400', dosha: ['Vata', 'Kapha'] },
  { id: '100', name: 'Wintergreen Oil', category: 'Joints', benefit: 'Strong pain relief', price: '₹150', image: 'https://picsum.photos/seed/wintergreen/400/400', dosha: ['Kapha'] },
  { id: '101', name: 'Camphor Oil', category: 'Joints', benefit: 'Cooling pain relief', price: '₹120', image: 'https://picsum.photos/seed/camphor/400/400', dosha: ['Pitta', 'Kapha'] }
];
