import { Request, Response, NextFunction } from 'express';

export const originGuard = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.get('origin') || req.get('referer');
  const devBase = process.env.SHORT_URL_BASE_DEV || 'http://localhost:3000';
  const prodBase = process.env.SHORT_URL_BASE_PROD;

  // If no origin/referer header, allow localhost and 127.0.0.1
  if (!origin) {
    const hostname = req.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return next();
    }
    return res.status(403).json({
      status: 'error',
      message: 'Access denied. Unauthorized origin.',
    });
  }

  // Allow requests from localhost (any port)
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return next();
  }

  // Allow requests from SHORT_URL_BASE_PROD if configured
  if (prodBase && origin.startsWith(prodBase)) {
    return next();
  }

  // Allow requests from SHORT_URL_BASE_DEV
  if (origin.startsWith(devBase)) {
    return next();
  }

  // Block unauthorized origins
  return res.status(403).json({
    status: 'error',
    message: 'Access denied. Unauthorized origin.',
  });
};
