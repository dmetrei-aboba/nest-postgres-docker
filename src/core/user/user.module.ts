import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { JwtModule } from 'core/jwt/jwt.module';

@Module({
  imports: [JwtModule, SequelizeModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
