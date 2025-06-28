import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RoutesRepository } from './repositories/routes.repository';
import { UsersRepository } from '../auth/repositories/users.repository';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'defaultSecret', // Set the secret key
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN || '3600s', // Set expiration time
      },
    }),
  ],
  controllers: [RoutesController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    RoutesService,
    RoutesRepository,
    UsersRepository,
  ],
})
export class RoutesModule {}
