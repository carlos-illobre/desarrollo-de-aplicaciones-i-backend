import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UsersRepository } from './repositories/users.repository';
import { InMemoryCache } from 'src/common/inMemoryCache';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { OtpRepository } from './repositories/otp.repository';

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
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersRepository,
    InMemoryCache,
    OtpRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
