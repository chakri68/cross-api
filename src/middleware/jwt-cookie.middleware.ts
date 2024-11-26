import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtCookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Read the JWT from cookies
    const token = req.cookies?.jwt; // Assuming the cookie name is `jwt`

    if (!token) {
      req['user'] = null; // Attach null user to the request
      next();
    } else {
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
}
