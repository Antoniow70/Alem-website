export function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[API LOG] ${req.method} ${req.originalUrl} - status: ${res.statusCode} - duration: ${duration}ms`);
  });
  next();
}
