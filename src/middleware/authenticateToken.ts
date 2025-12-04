import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key';

// Udvider Request-typen så vi kan gemme "user" på req-objektet
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Hvis der ikke er en Authorization-header, afvis request
  if (!authHeader) {
    return res.status(401).json({ message: 'No token found (requires Authorization header)' });
  }

  // Del headeren op i to dele: "Bearer" og selve token
  const [type, token] = authHeader.split(' ');

  // Tjek om headeren er i korrekt format
  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Wrong token-format' });
  }

  try {
    // Tjek og dekod token med vores hemmelige nøgle
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    console.log(decoded);

    // Gem brugerinfo fra token på req, så routes kan bruge den
    req.user = decoded;

    // Gå videre til næste middleware/route
    return next();
  } catch (error) {
    console.error(error);
    // Token er ugyldig eller udløbet
    return res.status(401).json({ message: 'Token is expired' });
  }
};
