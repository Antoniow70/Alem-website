import app from './app.js';
import { config } from './config/env.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`\n Backend ALEM a correr na porta ${PORT}`);
  console.log(`   Ambiente: ${config.nodeEnv}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health`);
  console.log(`   Supabase URL: ${config.supabaseUrl ? '✅ configurado' : '❌ em falta'}\n`);
});
