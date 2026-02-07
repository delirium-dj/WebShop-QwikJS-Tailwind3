import fs from 'fs';
import path from 'path';

const edgeFuncDir = path.resolve('.netlify/edge-functions/entry.netlify-edge');

if (!fs.existsSync(edgeFuncDir)) {
  console.error(`Edge function directory not found: ${edgeFuncDir}`);
  process.exit(0);
}

console.log(`Fixing Netlify Edge Function build in: ${edgeFuncDir}`);

const files = fs.readdirSync(edgeFuncDir);

// 1. Rename files starting with @
for (const file of files) {
  if (file.startsWith('@')) {
    const oldPath = path.join(edgeFuncDir, file);
    const newName = file.replace(/^@/, '_');
    const newPath = path.join(edgeFuncDir, newName);
    
    console.log(`Renaming ${file} -> ${newName}`);
    fs.renameSync(oldPath, newPath);
  }
}

// 2. Update imports in all .js files
const updatedFiles = fs.readdirSync(edgeFuncDir);
for (const file of updatedFiles) {
  if (file.endsWith('.js')) {
    const filePath = path.join(edgeFuncDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes('./@')) {
      console.log(`Updating imports in ${file}`);
      const newContent = content.replace(/\.\/@/g, './_');
      fs.writeFileSync(filePath, newContent, 'utf8');
    }
  }
}

console.log('Fix complete!');
