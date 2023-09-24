import { Injectable, NestMiddleware } from '@nestjs/common';
import { CommonError } from 'common';
import { AUTH_ERRORS, USER_ERRORS } from 'consts';
import { JwtService } from 'core/jwt/jwt.service';
import { UserService } from 'core/user/user.service';
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from 'interfaces';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);

    if (!token) throw new CommonError(AUTH_ERRORS.AUTH_NOT_AUTHORIZED);

    const isValid = this.validateToken(token);

    if (!isValid) throw new CommonError(AUTH_ERRORS.AUTH_NOT_AUTHORIZED);

    const payload = this.jwtService.decode(token) as { id: string };

    const user = await this.userService.getUserById(payload.id);

    if (!user) throw new CommonError(USER_ERRORS.USER_NOT_FOUND);

    req.user = user;

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private validateToken(token: string) {
    try {
      return this.jwtService.check(token);
    } catch {
      return false;
    }
  }
}
