import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(__dirname, '../src');

const COLOR_NAME_REPLACEMENTS = {
  // Red / Rose / Danger / Errors
  'red-50': 'feedback-errorLight',
  'rose-50': 'feedback-errorLight',
  'red-100': 'feedback-errorBorder',
  'rose-100': 'feedback-errorBorder',
  'red-200': 'feedback-errorBorder',
  'rose-200': 'feedback-errorBorder',
  'red-400': 'feedback-error',
  'red-500': 'feedback-error',
  'red-600': 'feedback-error',
  'red-700': 'feedback-error',
  'rose-400': 'feedback-error',
  'rose-500': 'feedback-error',
  'rose-600': 'feedback-error',
  'rose-700': 'feedback-error',

  // Emerald / Green / Success
  'emerald-50': 'feedback-successLight',
  'green-50': 'feedback-successLight',
  'emerald-100': 'feedback-successBorder',
  'green-100': 'feedback-successBorder',
  'green-200': 'feedback-successBorder',
  'emerald-400': 'feedback-success',
  'emerald-500': 'feedback-success',
  'emerald-600': 'feedback-success',
  'emerald-700': 'feedback-success',
  'green-500': 'feedback-success',
  'green-600': 'feedback-success',
  'green-700': 'feedback-success',

  // Indigo / Purple-Blue (mapped to brand colors for design system consistency)
  'indigo-50': 'brand-poloBlue/15',
  'indigo-100': 'brand-poloBlue/20',
  'indigo-200': 'brand-poloBlue/30',
  'indigo-500': 'brand-horizon',
  'indigo-600': 'brand-eastBay',
  'indigo-700': 'brand-bigStone',

  // Amber / Yellow / Warnings / Status
  'amber-50': 'feedback-warningLight',
  'yellow-50': 'feedback-warningLight',
  'amber-100': 'feedback-warningBorder',
  'yellow-100': 'feedback-warningBorder',
  'amber-600': 'feedback-warning',
  'yellow-600': 'feedback-warning',
  'amber-800': 'feedback-warningText',
  'amber-900': 'feedback-warningMuted',

  // Blue / Light Blue (mapped to brand colors)
  'blue-50': 'brand-poloBlue/15',
  'blue-100': 'brand-poloBlue/20',
  'blue-200': 'brand-poloBlue/30',
  'blue-300': 'brand-poloBlue/50',
  'blue-400': 'brand-poloBlue',
  'blue-500': 'brand-horizon',
  'blue-600': 'brand-horizon',
  'blue-700': 'brand-eastBay',
  'blue-800': 'brand-bigStone',
  'blue-900': 'brand-bigStone',

  // Gray/Slate text colors to match our dark/light mode standards
  'slate-900': 'brand-bigStone dark:text-dark-text',
  'slate-850': 'brand-bigStone dark:text-dark-text',
  'slate-800': 'brand-eastBay dark:text-dark-text',
  'slate-700': 'brand-eastBay dark:text-dark-text',
  'slate-600': 'brand-eastBay dark:text-dark-muted',
  'slate-550': 'brand-eastBay dark:text-dark-muted',
  'slate-50': 'brand-poloBlue/15',
  'slate-100': 'brand-poloBlue/20',
};

let currentFilePath = '';

const MAPPINGS = [
  // 1. Dynamic replacement of tailwind color classes
  {
    regex: /\b(bg|text|border|from|to|via|ring|shadow)-(red|rose|emerald|green|indigo|amber|yellow|blue|slate)-(50|100|200|300|400|500|600|700|800|850|900)(\/\d+)?\b/g,
    replacement: (match, prefix, name, value, opacity) => {
      const key = `${name}-${value}`;
      const baseToken = COLOR_NAME_REPLACEMENTS[key];
      if (baseToken) {
        if (opacity) {
          // If token has a default opacity like "brand-poloBlue/15", clean it and use current opacity
          const cleanToken = baseToken.split('/')[0];
          return `${prefix}-${cleanToken}${opacity}`;
        }
        return `${prefix}-${baseToken}`;
      }
      return match;
    }
  },

  // 2. Section background updates to allow smooth body gradient to shine through
  {
    regex: /\b(?:bg-slate-50|bg-white)\b/g,
    replacement: (match) => {
      const normalizedPath = currentFilePath.replace(/\\/g, '/');
      if (
        normalizedPath.includes('pages/Inicio.jsx') ||
        normalizedPath.includes('QuemSomos.jsx') ||
        normalizedPath.includes('OQueFazemos.jsx') ||
        normalizedPath.includes('Destaques.jsx')
      ) {
        return 'bg-transparent';
      }
      return match;
    }
  },

  // 3. Self-healing double opacity slashes like bg-brand-poloBlue/15/50 -> bg-brand-poloBlue/50
  {
    regex: /\b(bg|text|border|from|to|via|ring|shadow)-([a-zA-Z0-9-]+)\/(\d+)\/(\d+)\b/g,
    replacement: '$1-$2/$4'
  }
];

let filesProcessed = 0;
let totalReplacements = 0;

function processFile(filePath) {
  filesProcessed++;
  currentFilePath = filePath;
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  MAPPINGS.forEach((rule) => {
    const matchCount = (content.match(rule.regex) || []).length;
    if (matchCount > 0) {
      totalReplacements += matchCount;
      content = content.replace(rule.regex, rule.replacement);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[Migrado] ${path.relative(SRC_DIR, filePath)}`);
  }
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (stat.isFile() && /\.(js|jsx)$/.test(file)) {
      processFile(fullPath);
    }
  });
}

console.log('=== Iniciando Migracao de Cores Legacy para Brand Tokens (Avancado) ===');
walk(SRC_DIR);
console.log(`\nFim: ${filesProcessed} arquivos lidos, ${totalReplacements} substituicoes efetuadas.`);
