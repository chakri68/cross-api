import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add custom logic before the default behavior
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException('User is not authenticated');
    }
    return user;
  }

  /**
   * Override the default behavior to extract the JWT from cookies
   */
  getRequest(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies?.jwt; // Assuming the cookie name is 'jwt'

    if (!token) {
      throw new UnauthorizedException('Authentication cookie is missing');
    }

    // Attach the token to the authorization header to work with Passport JWT
    request.headers.authorization = `Bearer ${token}`;
    return request;
  }
}
