import TokenManager from '../security/token-manager.js';
import { AuthenticationError } from '../exceptions/index.js';

function authenticateToken(req, _res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AuthenticationError('Unauthorized'));
  }

  try {
    req.user = TokenManager.verify(header.split(' ')[1], process.env.ACCESS_TOKEN_KEY);
    return next();
  } catch (error) {
    return next(error);
  }
}

export default authenticateToken;
