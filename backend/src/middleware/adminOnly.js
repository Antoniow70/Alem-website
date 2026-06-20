export async function adminOnly(req, res, next) {
  // O utilizador ja foi validado pelo authGuard
  // Na nossa aplicacao, se esta logado, assume-se que e admin
  if (!req.user) {
    return res.status(403).json({ error: 'Acesso proibido.' });
  }
  next();
}
