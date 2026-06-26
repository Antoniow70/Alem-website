import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import module routers
import { authRouter } from './modules/auth/index.js';
import { beneficiariosRouter } from './modules/beneficiarios/index.js';
import { projetosRouter } from './modules/projetos/index.js';
import { equipaRouter } from './modules/equipa/index.js';
import { voluntariosRouter } from './modules/voluntarios/index.js';
import { parceirosRouter } from './modules/parceiros/index.js';
import { doacoesRouter } from './modules/doacoes/index.js';
import { suporteRouter } from './modules/suporte/index.js';
import { uploadRouter } from './modules/upload/index.js';
import { reportsRouter } from './modules/reports/index.js';
import { documentosRouter } from './modules/documentos/index.js';

const app = express();

// ─── Global Middlewares ──────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('A política CORS não permite acesso desta origem.'), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(rateLimiter);

// ─── Health Check ────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API ALEM a funcionar',
    timestamp: new Date().toISOString()
  });
});

// ─── API Routes ──────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/beneficiarios', beneficiariosRouter);
app.use('/api/projetos', projetosRouter);
app.use('/api/equipa', equipaRouter);
app.use('/api/voluntarios', voluntariosRouter);
app.use('/api/parceiros', parceirosRouter);
app.use('/api/doacoes', doacoesRouter);
app.use('/api/suporte', suporteRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/documentos', documentosRouter);

// ─── 404 Handler ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Rota ${req.method} ${req.originalUrl} não encontrada.` });
});

// ─── Global Error Handler ────────────────────────────────
app.use(errorHandler);

export default app;
