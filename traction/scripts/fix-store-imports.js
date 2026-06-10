const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REPLACEMENTS = [
  { from: /@\/nearby-stores\/use-auth-store/g, to: '@/nearby-stores/nearby-auth-store' },
  { from: /@\/nearby-stores\/use-location-store/g, to: '@/nearby-stores/nearby-location-store' }
];

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(file)) continue;
      walk(filepath, callback);
    } else {
      if (filepath.endsWith('.ts') || filepath.endsWith('.tsx')) {
        callback(filepath);
      }
    }
  }
}

console.log('Fixing store imports...');
walk(ROOT, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  
  for (const repl of REPLACEMENTS) {
    content = content.replace(repl.from, repl.to);
  }
  
  if (content !== originalContent) {
    console.log(`Updated imports in ${filepath}`);
    fs.writeFileSync(filepath, content, 'utf8');
  }
});

console.log('Done fixing imports!');
