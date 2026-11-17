import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screensDir = path.join(__dirname, 'src', 'screens');

// 1. Patch HistoryScreen
const historyPath = path.join(screensDir, 'HistoryScreen.tsx');
if (fs.existsSync(historyPath)) {
  let content = fs.readFileSync(historyPath, 'utf-8');
  if (!content.includes('getHistoryLocally')) {
    content = `import { getHistoryLocally } from '../lib/localHistory';\n` + content;
  }
  content = content.replace(
    /const q = query\([\s\S]*?orderBy\('createdAt', 'desc'\)\s*\);\s*const unsubscribe = onSnapshot\(q, \(snapshot\) => \{[\s\S]*?\}\);/m,
    `    const loadHistory = async () => {
      try {
        const localProfiles = await getHistoryLocally(userData.uid);
        // Normalize createdAt which might be a timestamp number to an object with toDate() for backward compatibility
        const normalizedProfiles = localProfiles.map(p => ({
          ...p,
          createdAt: {
            toDate: () => new Date(p.createdAt)
          }
        }));
        setProfiles(normalizedProfiles);
      } catch (error) {
        console.error("Local history error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadHistory();`
  );
  content = content.replace(/return \(\) => unsubscribe\(\);/g, '');
  fs.writeFileSync(historyPath, content);
}

// 2. Patch ResultScreen
const resultPath = path.join(screensDir, 'ResultScreen.tsx');
if (fs.existsSync(resultPath)) {
  let content = fs.readFileSync(resultPath, 'utf-8');
  if (!content.includes('getProfileLocally')) {
    content = `import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';\n` + content;
  }
  content = content.replace(
    /const profileRef = doc\(db, 'health_profiles', profileId\);\s+const profileSnap = await getDoc\(profileRef\);\s+if \(!profileSnap.exists\(\)\) \{/,
    `const data = await getProfileLocally(profileId);
      if (!data) {`
  );
  
  content = content.replace(
    /const data = profileSnap.data\(\);/,
    ''
  );
  
  // Replace updateDoc for sketch
  content = content.replace(
    /const profileRef = doc\(db, 'health_profiles', profileId\);\s+await updateDoc\(profileRef, \{/,
    `await updateProfileLocally(profileId, {`
  );
  fs.writeFileSync(resultPath, content);
}

// 3. Patch FaceGlowResultScreen
const faceGlowPath = path.join(screensDir, 'FaceGlowResultScreen.tsx');
if (fs.existsSync(faceGlowPath)) {
  let content = fs.readFileSync(faceGlowPath, 'utf-8');
  if (!content.includes('getProfileLocally')) {
    content = `import { getProfileLocally, updateProfileLocally } from '../lib/localHistory';\n` + content;
  }
  content = content.replace(
    /const profileRef = doc\(db, 'health_profiles', profileId\);\s+const profileSnap = await getDoc\(profileRef\);\s+if \(!profileSnap.exists\(\)\) \{/,
    `const data = await getProfileLocally(profileId);
      if (!data) {`
  );
  content = content.replace(
    /const data = profileSnap.data\(\);/,
    ''
  );
  // Replace sketch update
  content = content.replace(
    /const profileRef = doc\(db, 'health_profiles', profileId\);\s+await updateDoc\(profileRef, \{/,
    `await updateProfileLocally(profileId, {`
  );
  fs.writeFileSync(faceGlowPath, content);
}

console.log("Patched reads");
