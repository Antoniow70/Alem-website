export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params
    });
    next();
  } catch (error) {
    const errorDetails = error.errors ? error.errors : error.message;
    const errorString = typeof errorDetails === 'string' ? errorDetails : JSON.stringify(errorDetails, null, 2);
    console.error('Validation Error Details:', errorString);
    console.error('Received Body keys:', req.body ? Object.keys(req.body) : 'none');
    return res.status(400).json({
      success: false,
      error: `Dados de validação incorretos. Detalhes: ${errorString}`,
      details: errorDetails
    });
  }
};
