import fs from 'fs';
import path from 'path';

const screensDir = path.join(process.cwd(), 'src/screens');

const idMap = {
  'BodyScanScreen.tsx': 'body-scan',
  'FaceGlowScreen.tsx': 'face-glow',
  'FuturePredictorScreen.tsx': 'future-predictor',
  'HairFallAnalyzerScreen.tsx': 'hair-fall',
  'EnergyBoosterScreen.tsx': 'energy-booster',
  'GutHealthAnalyzerScreen.tsx': 'gut-health',
  'HormonalBalanceScreen.tsx': 'hormonal-balance',
  'LiverHealthScreen.tsx': 'liver-health',
  'HealthScanScreen.tsx': 'health-scan',
  'MoodAyurvedaScreen.tsx': 'mood-ayurveda',
};

for (const [file, id] of Object.entries(idMap)) {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('FeatureBlog')) {
    content = `import FeatureBlog from '../components/FeatureBlog';\n` + content;
    // Find the last closing div before the final return/closing tags. Simple regex for the last `    </div>\n  );\n}`
    content = content.replace(/(    <\/div>\s*)\s*(<\/div>\s*);\s*}/, `$1  <FeatureBlog featureId="${id}" />\n$2;}`);
    fs.writeFileSync(filePath, content);
  }
}

// Special case for GoalWellnessScreen
{
  const filePath = path.join(screensDir, 'GoalWellnessScreen.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('FeatureBlog')) {
    content = `import FeatureBlog from '../components/FeatureBlog';\n` + content;
    content = content.replace(/(        <\/form>\s*)\s*(<\/div>\s*<\/div>\s*);\s*}/, `$1  <FeatureBlog featureId={goalId || ''} />\n$2;}`);
    fs.writeFileSync(filePath, content);
  }
}

// Special case for DailyRoutineScreen
{
  const filePath = path.join(screensDir, 'DailyRoutineScreen.tsx');
  let content = fs.readFileSync(filePath, 'utf8');
  if (!content.includes('FeatureBlog')) {
    content = `import FeatureBlog from '../components/FeatureBlog';\n` + content;
    
    // Replace the existing static block with <FeatureBlog />
    // The static block is after <AnimatePresence> ... </AnimatePresence> and before the final </div>
    const regex = /\{\/\* SEO Blog Content \*\/\}.*?(?=<\/div>\s*<\/div>\s*\);)/s;
    if (regex.test(content)) {
        content = content.replace(regex, '<FeatureBlog featureId="daily-routine" />\n      ');
        fs.writeFileSync(filePath, content);
    }
  }
}

console.log("Done");
