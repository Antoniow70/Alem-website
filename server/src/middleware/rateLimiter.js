// Simple memory rate limiter
const hits = new Map();

export function rateLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxLimit = 100; // max 100 requests per minute

  if (!hits.has(ip)) {
    hits.set(ip, []);
  }

  const userHits = hits.get(ip).filter(timestamp => now - timestamp < limitWindow);
  userHits.push(now);
  hits.set(ip, userHits);

  if (userHits.length > maxLimit) {
    return res.status(429).json({ error: 'Muitas requisições. Tente mais tarde.' });
  }

  next();
}
