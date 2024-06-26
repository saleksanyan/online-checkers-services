import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    console.log(req.headers); 

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = tokenParts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req['user'] = decoded;
      next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token.' });
    }
  }
}
