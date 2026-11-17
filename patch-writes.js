import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screensDir = path.join(__dirname, 'src', 'screens');

const filesToPatch = [
  'BodyScanScreen.tsx',
  'EnergyBoosterScreen.tsx',
  'FaceGlowScreen.tsx',
  'FuturePredictorScreen.tsx',
  'GoalWellnessScreen.tsx',
  'GutHealthAnalyzerScreen.tsx',
  'HairFallAnalyzerScreen.tsx',
  'HealthScanScreen.tsx',
  'HormonalBalanceScreen.tsx',
  'LiverHealthScreen.tsx'
];

for (const file of filesToPatch) {
  const p = path.join(screensDir, file);
  if (!fs.existsSync(p)) continue;
  
  let content = fs.readFileSync(p, 'utf-8');
  
  if (!content.includes('saveProfileLocally')) {
    const importStatement = `import { saveProfileLocally } from '../lib/localHistory';\n`;
    content = importStatement + content;
  }

  // Replace `const docRef = await addDoc(collection(db, 'health_profiles'), profileData);`
  content = content.replace(
    /const (\w+) = await addDoc\(collection\(db, 'health_profiles'\), profileData\);/g,
    'const $1 = { id: await saveProfileLocally(profileData) };'
  );

  // Replace `const docRef = await addDoc(collection(db, 'health_profiles'), {`
  content = content.replace(
    /const (\w+) = await addDoc\(collection\(db, 'health_profiles'\), (\{[\s\S]*?})\);/g,
    (match, p1, p2) => {
        // p2 is the object literal. We need to remove the trailing `createdAt: serverTimestamp()` if it's there.
        let obj = p2.replace(/createdAt: serverTimestamp\(\),?\n?\s*/g, '');
        return `const ${p1} = { id: await saveProfileLocally(${obj}) };`;
    }
  );

  // Replace without assignment `await addDoc(collection(db, 'health_profiles'), {`
  content = content.replace(
    /await addDoc\(collection\(db, 'health_profiles'\), (\{[\s\S]*?})\);/g,
    (match, p1) => {
        let obj = p1.replace(/createdAt: serverTimestamp\(\),?\n?\s*/g, '');
        return `await saveProfileLocally(${obj});`;
    }
  );

  fs.writeFileSync(p, content);
}

console.log("Patched write files");
