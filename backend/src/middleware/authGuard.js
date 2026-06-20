import { supabaseAdmin } from '../infra/supabaseAdmin.js';

export async function authGuard(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso negado. Token em falta.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao validar sessão.' });
  }
}
