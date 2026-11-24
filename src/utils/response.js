export default function response(res, statusCode, message, data) {
  const payload = { status: 'success', message };
  if (data !== undefined) payload.data = data;
  return res.status(statusCode).json(payload);
}
