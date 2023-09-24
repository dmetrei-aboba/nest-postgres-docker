import { Injectable } from '@nestjs/common';
import { UserService } from 'core/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'core/user/user.model';
import { CommonError } from 'common';
import { AUTH_ERRORS } from 'consts';
import { JwtService } from 'core/jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async signUp(body: any) {
    const { password, ...data } = body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await this.userService.createUser({
      ...data,
      encryptedPassword,
    });

    return this.createToken(user.id);
  }

  async signIn(body: { email?: string; phone?: string; password: string }) {
    const { password, ...data } = body;

    let user: User;

    if (data.email) user = await this.userService.getUserByEmail(data.email);
    else if (data.phone)
      user = await this.userService.getUserByPhone(data.phone);
    else return;

    if (!user) throw new CommonError(AUTH_ERRORS.AUTH_WRONG_CREDENTIALS);

    const isPasswordValid = await bcrypt.compare(
      password,
      user.encryptedPassword,
    );

    if (!isPasswordValid)
      throw new CommonError(AUTH_ERRORS.AUTH_WRONG_PASSWORD);

    return this.createToken(user.id);
  }

  private createToken(id: string) {
    return this.jwtService.generate(id);
  }
}
