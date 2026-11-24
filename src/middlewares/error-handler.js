import { ClientError, NotFoundError } from '../exceptions/index.js';

export function notFoundRoute(_req, _res, next) {
  next(new NotFoundError('Endpoint tidak ditemukan'));
}
export function errorHandler(error, _req, res, _next) {
  if (error instanceof ClientError) {
    return res.status(error.statusCode).json({ status: 'fail', message: error.message });
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ status: 'fail', message: 'Format JSON tidak valid' });
  }
  console.error(error);
  return res.status(500).json({ status: 'error', message: 'Terjadi kegagalan pada server' });
}
