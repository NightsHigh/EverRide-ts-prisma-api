import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Ingen authorization header fundet' });
  }

  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Forkert format på authorization header. Forventet format: Bearer <token>' });
  }

  const token = parts[1];

  if (!token) {
    return res.status(401).json({ error: 'Token mangler' });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('JWT_SECRET er ikke defineret i miljøvariablerne');
    return res.status(500).json({ error: 'Server konfigurationsfejl' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    
    req.user = decoded;
    
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token er udløbet' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Ugyldig token' });
    } else {
      return res.status(401).json({ error: 'Token validering fejlede' });
    }
  }
};

