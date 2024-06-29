import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token no proporcionado' });

  jwt.verify(token, 'your_secret_key', (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
    if (err) return res.status(401).json({ message: 'Token inválido' });
    if (decoded && typeof decoded !== 'string') {
      (req as any).user = decoded; 
    }
    next();
  });
}
