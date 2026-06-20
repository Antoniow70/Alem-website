import fs from 'fs';
import path from 'path';

const FILES_TO_AUDIT = [
  'src/pages/Inicio.jsx',
  'src/domains/equipa/pages/QuemSomos.jsx',
  'src/domains/projetos/pages/OQueFazemos.jsx',
  'src/domains/projetos/pages/Destaques.jsx',
  'src/pages/Contactos.jsx',
  'src/pages/Localizacao.jsx',
  'src/domains/doacoes/pages/Doar.jsx'
];

const workspaceRoot = path.resolve('.');

console.log('=== [Relatorio de Auditoria de Cores e Estilos nas Telas] ===\n');

FILES_TO_AUDIT.forEach((relPath) => {
  const fullPath = path.join(workspaceRoot, relPath);
  if (!fs.existsSync(fullPath)) {
    console.log(`[AVISO] Arquivo nao encontrado: ${relPath}\n`);
    return;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  let issuesFound = 0;

  console.log(`Auditando: ${relPath}`);

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    let lineIssues = [];

    // 1. Detect Hex colors
    const hexMatch = line.match(/#[0-9a-fA-F]{3,8}/);
    if (hexMatch) {
      lineIssues.push(`Hex Color encontrado ("${hexMatch[0]}")`);
    }

    // 2. Detect rgb/rgba/hsl/hsla
    const rgbMatch = line.match(/(rgb|rgba|hsl|hsla)\([^)]*\)/i);
    if (rgbMatch) {
      lineIssues.push(`Funcao de Cor CSS encontrada ("${rgbMatch[0]}")`);
    }

    // 3. Detect inline style color/bg properties
    const inlineStyleMatch = line.match(/style\s*=\s*\{\{\s*[^}]*(color|background|borderColor)\s*:[^}]*\}\}/i);
    if (inlineStyleMatch) {
      lineIssues.push(`Estilo Inline de Cor detectado`);
    }

    // 4. Detect Tailwind arbitrary brackets color
    const arbitraryMatch = line.match(/(bg|text|border|from|to|via|ring|shadow)-\[([^\]]+)\]/);
    if (arbitraryMatch) {
      const value = arbitraryMatch[2];
      // Ignore non-color arbitrary values like text-[12px] or rounded-[40px]
      if (value.startsWith('#') || value.includes('rgba') || value.includes('rgb') || value.includes('hsl') || ['red', 'blue', 'green', 'black', 'white'].includes(value)) {
        lineIssues.push(`Tailwind Arbitrario com Cor detectado ("${arbitraryMatch[0]}")`);
      }
    }

    // 5. Detect legacy primary/secondary tailwind colors that could be replaced with our brand tokens
    // We check for bg-blue-600, text-blue-600, etc.
    const legacyColorMatch = line.match(/\b(bg|text|border|from|to|via|ring)-(blue|green|emerald|amber|indigo|red|yellow|purple)-(50|100|200|300|400|500|600|700|800|900)\b/);
    if (legacyColorMatch) {
      lineIssues.push(`Uso de Cor Legacy do Tailwind ("${legacyColorMatch[0]}") - Recomendado substituir por token brand-* ou dark-*`);
    }

    if (lineIssues.length > 0) {
      issuesFound++;
      console.log(`  - Linha ${lineNum}: ${line.trim()}`);
      lineIssues.forEach((issue) => console.log(`      * ${issue}`));
    }
  });

  if (issuesFound === 0) {
    console.log('  -> Nenhuma inconformidade de cor ou estilo encontrada!');
  }
  console.log('');
});
