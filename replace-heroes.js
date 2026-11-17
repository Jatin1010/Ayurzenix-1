import fs from 'fs';
import path from 'path';

const screensDir = path.join(process.cwd(), 'src/screens');

const replaceInFile = (filePath) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  // Match relative overflow-hidden rounded-[2.5rem] bg-gray-900 p-X shadow-[...] border border-gray-800
  const updatedContent = fileContent.replace(
    /relative overflow-hidden rounded-\[(?:2\.5rem|3xl)\] bg-gray-900 p-\d+\s*(?:text-white\s*space-y-\d+\s*)?shadow-\[.*?\] border border-gray-800/g,
    'modern-hero'
  );
  if (fileContent !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent);
    console.log(`Updated ${filePath}`);
  }
};

const screens = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx'));
screens.forEach(file => {
  replaceInFile(path.join(screensDir, file));
});
