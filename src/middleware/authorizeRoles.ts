import { Request, Response, NextFunction } from 'express';


export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Unauthorized - Du skal være logget ind for at tilgå denne ressource' 
      });
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: `Forbidden - Du har ikke adgang til denne ressource. Kræver rolle: ${allowedRoles.join(' eller ')}` 
      });
    }

    next();
  };
};

