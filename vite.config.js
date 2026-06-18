import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

// --- ACCENT CLEANER SCRIPT ---
// Este script corre automaticamente quando o Vite inicia/recarrega e remove
// acentos de todos os ficheiros de texto do projeto.
const TARGET_EXTENSIONS = ['.js', '.jsx', '.html', '.css', '.sql'];
const IGNORED_DIRECTORIES = ['node_modules', '.git', 'dist', '.gemini', 'scratch'];

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = removeAccents(content);
    if (content !== cleanedContent) {
      fs.writeFileSync(filePath, cleanedContent, 'utf8');
      console.log(`[Cleaner] Processado e limpo: ${filePath}`);
    }
  } catch (err) {
    // Silencioso em caso de erros de leitura de permissão
  }
}

function walk(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
  } catch (err) {
    return;
  }
  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (err) {
      continue;
    }
    if (stat.isDirectory()) {
      if (IGNORED_DIRECTORIES.includes(file)) continue;
      walk(fullPath);
    } else if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      // Nao processamos o proprio vite.config.js para nao remover as instrucoes do script
      if (TARGET_EXTENSIONS.includes(ext) && file !== 'vite.config.js') {
        processFile(fullPath);
      }
    }
  }
}

try {
  walk('.');
} catch (e) {
  console.error('[Cleaner] Falha ao executar limpeza:', e);
}
// -----------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâ€”file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
