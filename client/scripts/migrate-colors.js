import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

// Mappings of hex -> Tailwind semantic tokens
const COLOR_MAPPINGS = {
  '#14213d': 'brand-bigStone',
  '#14213D': 'brand-bigStone',
  '#1d2d44': 'brand-eastBay',
  '#1D2D44': 'brand-eastBay',
  '#2563eb': 'brand-horizon',
  '#2563EB': 'brand-horizon',
  '#ffffff': 'white',
  '#ffffff03': 'white/5',
  '#fff': 'white',
  '#0F172A': 'brand-bigStone',
  '#0f172a': 'brand-bigStone',
  '#22c55e': 'brand-poloBlue',
  '#1f2937': 'brand-bigStone',
};

// Files scanned count
let filesScanned = 0;
let colorsReplaced = 0;
let unmappedColors = 0;
const unmappedList = [];

function processFile(filePath) {
  filesScanned++;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Detect hex colors: #123, #1234, #123456, #12345678
  const hexRegex = /#([0-9a-fA-F]{3,8})/g;
  
  // Let's also find tailwind arbitrary classes like bg-[#...] or text-[#...]
  // E.g. bg-[#14213D]/95 or text-[#14213D]
  const arbitraryRegex = /(bg|text|border|from|to|via|ring|shadow)-\[#([0-9a-fA-F]{3,8})\](?:\/([0-9]+))?/g;

  // Replace arbitrary classes first
  content = content.replace(arbitraryRegex, (match, type, hex, opacity) => {
    const fullHex = '#' + hex;
    const token = COLOR_MAPPINGS[fullHex] || COLOR_MAPPINGS[fullHex.toLowerCase()];
    if (token) {
      colorsReplaced++;
      const opSuffix = opacity ? `/${opacity}` : '';
      if (token === 'white') {
        return `${type}-white${opSuffix}`;
      }
      return `${type}-${token}${opSuffix}`;
    } else {
      unmappedColors++;
      unmappedList.push({ file: filePath, match, color: fullHex });
      return match;
    }
  });

  // Replace raw hex codes (e.g. style={{ color: '#14213D' }})
  // Exclude hex colors within CSS variables or already defined in index.css mappings
  if (!filePath.endsWith('index.css') && !filePath.endsWith('tailwind.config.ts')) {
    content = content.replace(hexRegex, (match, g1, offset, str) => {
      const beforeMatch = str.substring(0, offset);
      const lineStart = beforeMatch.lastIndexOf('\n') + 1;
      const currentLineBeforeMatch = beforeMatch.substring(lineStart);
      if (currentLineBeforeMatch.includes('//') || currentLineBeforeMatch.includes('/*')) {
        return match;
      }
      const token = COLOR_MAPPINGS[match] || COLOR_MAPPINGS[match.toLowerCase()];
      if (token) {
        colorsReplaced++;
        return `var(--color-${token.replace(/[A-Z]/g, m => '-' + m.toLowerCase())})`;
      } else {
        unmappedColors++;
        unmappedList.push({ file: filePath, match, color: match });
        return match;
      }
    });
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (stat.isFile() && /\.(js|jsx|css)$/.test(file)) {
      processFile(fullPath);
    }
  });
}

walk(SRC_DIR);

console.log('[Migration Report]');
console.log(`- Files scanned: ${filesScanned}`);
console.log(`- Colors replaced: ${colorsReplaced}`);
console.log(`- Unmapped colors: ${unmappedColors}`);
if (unmappedList.length > 0) {
  console.log('\n[Unmapped Colors Details]');
  unmappedList.forEach(item => {
    console.log(`  File: ${path.relative(SRC_DIR, item.file)} -> Found: "${item.match}" (Color: ${item.color})`);
  });
}
