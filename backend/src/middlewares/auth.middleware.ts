import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '@config/env';
import { errorResponse } from '@utils/response';

export interface AuthPayload {
  userId: string;
  email: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return errorResponse(res, 'Not authenticated', 401);
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, 'Invalid or expired token', 401);
  }
};

/**
 * In the future, when I implement roles and protected routes, in routes.ts files:
 
import { Router } from 'express';
import { authMiddleware } from '@middlewares/auth.middleware';

const router = Router();

router.get('/me', authMiddleware, (req, res) => {      <-
  res.json({ user: req.user });
});

export default router;

 * 
 */
