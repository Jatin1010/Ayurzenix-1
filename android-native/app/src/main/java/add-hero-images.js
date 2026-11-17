import fs from 'fs';
import path from 'path';

const screensDir = path.join(process.cwd(), 'src/screens');

const idMap = {
  'BodyScanScreen.tsx': 'anatomy',
  'FaceGlowScreen.tsx': 'skincare',
  'FuturePredictorScreen.tsx': 'dna',
  'HairFallAnalyzerScreen.tsx': 'haircare',
  'EnergyBoosterScreen.tsx': 'vitality',
  'GutHealthAnalyzerScreen.tsx': 'digestion',
  'HormonalBalanceScreen.tsx': 'hormones',
  'LiverHealthScreen.tsx': 'detox',
  'HealthScanScreen.tsx': 'healthscan',
  'MoodAyurvedaScreen.tsx': 'meditation',
  'DailyRoutineScreen.tsx': 'sunrise',
};

for (const [file, seed] of Object.entries(idMap)) {
  const filePath = path.join(screensDir, file);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Prevent double application
  if (content.includes('mix-blend-luminosity')) continue;

  const replaceTarget = /<div className="modern-hero(.*?)">\s*<div className="absolute top-0 right-0/g;
  const replacement = `<div className="modern-hero group$1">
          <img 
            src="https://picsum.photos/seed/${seed}/800/400" 
            alt="Feature Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040A18] via-[#0B1B3D]/80 to-transparent" />
          <div className="absolute top-0 right-0`;

  content = content.replace(replaceTarget, replacement);
  fs.writeFileSync(filePath, content);
}

// Special case for GoalWellnessScreen.tsx
{
  const filePath = path.join(screensDir, 'GoalWellnessScreen.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('mix-blend-luminosity')) {
      const replaceTarget = /<div className="modern-hero(.*?)">\s*<div className="absolute top-0 right-0/g;
      const replacement = `<div className="modern-hero group$1">
          <img 
            src={\`https://picsum.photos/seed/\${goalId || 'wellness'}/800/400\`}
            alt="Feature Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040A18] via-[#0B1B3D]/80 to-transparent" />
          <div className="absolute top-0 right-0`;
      content = content.replace(replaceTarget, replacement);
      fs.writeFileSync(filePath, content);
  }
}

// Special case for HealthScanScreen.tsx inside motion.div 
{
  const filePath = path.join(screensDir, 'HealthScanScreen.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.match(/<div className="modern-hero group(.*?)">/g)?.length < content.match(/modern-hero/g)?.length) {
      const replaceTarget = /<div className="modern-hero(.*?)">\s*<div className="absolute top-0 right-0/g;
      const replacement = `<div className="modern-hero group$1">
          <img 
            src="https://picsum.photos/seed/healthscan/800/400" 
            alt="Feature Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 group-hover:opacity-40 transition-all duration-1000" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#040A18] via-[#0B1B3D]/80 to-transparent" />
          <div className="absolute top-0 right-0`;
      content = content.replace(replaceTarget, replacement);
      fs.writeFileSync(filePath, content);
  }
}

console.log("Images injected.");
