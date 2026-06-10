const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const RENAME_DIRS = {
  'components/auth': 'components/nearby-auth',
  'components/layout': 'components/nearby-layout',
  'components/map': 'components/nearby-map',
  'components/members': 'components/nearby-members',
  'components/ui': 'components/nearby-ui',
  'stores': 'nearby-stores'
};

const RENAME_FILES = {
  'lib/auth.ts': 'lib/nearby-auth.ts',
  'lib/categories.ts': 'lib/nearby-categories.ts',
  'lib/types.ts': 'lib/nearby-types.ts',
  'lib/utils.ts': 'lib/nearby-utils.ts',
  'lib/rate-limit.ts': 'lib/nearby-rate-limit.ts',
  'lib/india-cities.ts': 'lib/nearby-india-cities.ts',
  'nearby-stores/use-auth-store.ts': 'nearby-stores/nearby-auth-store.ts',
  'nearby-stores/use-location-store.ts': 'nearby-stores/nearby-location-store.ts'
};

const IMPORT_REPLACEMENTS = [
  { from: /@\/components\/auth\//g, to: '@/components/nearby-auth/' },
  { from: /@\/components\/layout\//g, to: '@/components/nearby-layout/' },
  { from: /@\/components\/map\//g, to: '@/components/nearby-map/' },
  { from: /@\/components\/members\//g, to: '@/components/nearby-members/' },
  { from: /@\/components\/ui\//g, to: '@/components/nearby-ui/' },
  { from: /@\/stores\//g, to: '@/nearby-stores/' },
  { from: /@\/stores\/use-auth-store/g, to: '@/nearby-stores/nearby-auth-store' },
  { from: /@\/stores\/use-location-store/g, to: '@/nearby-stores/nearby-location-store' },
  { from: /@\/lib\/auth/g, to: '@/lib/nearby-auth' },
  { from: /@\/lib\/categories/g, to: '@/lib/nearby-categories' },
  { from: /@\/lib\/types/g, to: '@/lib/nearby-types' },
  { from: /@\/lib\/utils/g, to: '@/lib/nearby-utils' },
  { from: /@\/lib\/rate-limit/g, to: '@/lib/nearby-rate-limit' },
  { from: /@\/lib\/india-cities/g, to: '@/lib/nearby-india-cities' },
];

function renameSyncSafe(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    console.log(`Renaming ${oldPath} to ${newPath}`);
    fs.renameSync(oldPath, newPath);
  } else {
    console.log(`Warning: ${oldPath} does not exist`);
  }
}

// 1. Rename directories
for (const [oldDir, newDir] of Object.entries(RENAME_DIRS)) {
  renameSyncSafe(path.join(ROOT, oldDir), path.join(ROOT, newDir));
}

// 2. Rename files
for (const [oldFile, newFile] of Object.entries(RENAME_FILES)) {
  renameSyncSafe(path.join(ROOT, oldFile), path.join(ROOT, newFile));
}

// 3. Update imports recursively
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

console.log('Updating imports...');
walk(ROOT, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let originalContent = content;
  
  for (const repl of IMPORT_REPLACEMENTS) {
    content = content.replace(repl.from, repl.to);
  }
  
  if (content !== originalContent) {
    console.log(`Updated imports in ${filepath}`);
    fs.writeFileSync(filepath, content, 'utf8');
  }
});

console.log('Done!');
