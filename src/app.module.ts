import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { UserModule } from './core/user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'core/user/user.model';
import { DB } from 'config';
import { AuthMiddleware } from 'middlewares';
import { JwtModule } from './core/jwt/jwt.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule,
    SequelizeModule.forRoot({
      uri: DB.URL,
      dialect: 'postgres',
      models: [User],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).exclude('auth/(.*)').forRoutes('*');
  }
}
