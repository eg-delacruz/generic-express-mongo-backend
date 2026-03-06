import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '@utils/response';
import env from '@config/env'; // env.VITE_CLIENT_HEADER_KEY
import { logger } from '@config/logger';

export function clientHeaderCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const clientHeader = req.headers['x-client-key'];

  if (!clientHeader) {
    return errorResponse(
      res,
      'Internal Server Error',
      500,
      'Missing client header'
    );
  }

  if (clientHeader !== env.VITE_CLIENT_HEADER_KEY) {
    logger.error(`Invalid client header: ${clientHeader}`);
    return errorResponse(
      res,
      'Internal Server Error',
      500,
      'Invalid client header'
    );
  }

  next();
}
