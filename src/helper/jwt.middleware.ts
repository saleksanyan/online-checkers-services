import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header not found');
    }

    try {
      const token = authHeader.split(' ')[1]; 
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      
      req['user'] = decoded;

      next(); 
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
