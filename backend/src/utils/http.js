class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON request body' });
  }
  if (err.code === '23505') {
    return res.status(409).json({ error: 'This record already exists' });
  }
  if (err.code === '23503') {
    return res.status(409).json({ error: 'Record is referenced by other data' });
  }
  if (err.code === '23514' || err.code === '22P02') {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500
    ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
}

module.exports = { HttpError, asyncHandler, errorHandler };
