const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const RENAME_DIRS = {
  'components/auth': 'components/atlas-auth',
  'components/layout': 'components/atlas-layout',
  'components/map': 'components/atlas-map',
  'components/members': 'components/atlas-members',
  'components/ui': 'components/atlas-ui',
  'stores': 'atlas-stores'
};

const RENAME_FILES = {
  'lib/auth.ts': 'lib/atlas-auth.ts',
  'lib/categories.ts': 'lib/atlas-categories.ts',
  'lib/types.ts': 'lib/atlas-types.ts',
  'lib/utils.ts': 'lib/atlas-utils.ts',
  'lib/rate-limit.ts': 'lib/atlas-rate-limit.ts',
  'lib/india-cities.ts': 'lib/atlas-india-cities.ts',
  'atlas-stores/use-auth-store.ts': 'atlas-stores/atlas-auth-store.ts',
  'atlas-stores/use-location-store.ts': 'atlas-stores/atlas-location-store.ts'
};

const IMPORT_REPLACEMENTS = [
  { from: /@\/components\/auth\//g, to: '@/components/atlas-auth/' },
  { from: /@\/components\/layout\//g, to: '@/components/atlas-layout/' },
  { from: /@\/components\/map\//g, to: '@/components/atlas-map/' },
  { from: /@\/components\/members\//g, to: '@/components/atlas-members/' },
  { from: /@\/components\/ui\//g, to: '@/components/atlas-ui/' },
  { from: /@\/stores\//g, to: '@/atlas-stores/' },
  { from: /@\/stores\/use-auth-store/g, to: '@/atlas-stores/atlas-auth-store' },
  { from: /@\/stores\/use-location-store/g, to: '@/atlas-stores/atlas-location-store' },
  { from: /@\/lib\/auth/g, to: '@/lib/atlas-auth' },
  { from: /@\/lib\/categories/g, to: '@/lib/atlas-categories' },
  { from: /@\/lib\/types/g, to: '@/lib/atlas-types' },
  { from: /@\/lib\/utils/g, to: '@/lib/atlas-utils' },
  { from: /@\/lib\/rate-limit/g, to: '@/lib/atlas-rate-limit' },
  { from: /@\/lib\/india-cities/g, to: '@/lib/atlas-india-cities' },
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
