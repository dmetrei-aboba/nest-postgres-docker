import { Injectable } from '@nestjs/common';
import { JwtService as JWT } from '@nestjs/jwt';
import { JWT as JWT_CONST } from 'config';

@Injectable()
export class JwtService {
  constructor(private jwt: JWT) {}

  generate(id: string) {
    return this.jwt.sign(
      { id },
      { secret: JWT_CONST.SECRET_KEY, expiresIn: JWT_CONST.EXPIRES_IN },
    );
  }

  check(token: string) {
    return this.jwt.verify(token, { secret: JWT_CONST.SECRET_KEY });
  }

  decode(token: string) {
    return this.jwt.decode(token) as { id: string };
  }
}
