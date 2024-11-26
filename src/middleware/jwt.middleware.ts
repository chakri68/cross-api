import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify and decode the JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
      req['user'] = decoded; // Attach the user info to the request
      next(); // Proceed to the next middleware or controller
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
