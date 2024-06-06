import { verifyToken } from './jwt';

export const authenticate = (handler) => {
  return async (req, res) => {
    const token = req.cookies.auth;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    req.user = decoded;
    return handler(req, res);
  };
};
