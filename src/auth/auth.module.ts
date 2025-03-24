import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './service/auth.service';
import { UsersRepository } from './repositories/users.repository';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { OtpRepository } from './repositories/otp.repository';
import { MailingService } from 'src/common/mailing/mailing-service';
import { MailingRepository } from './repositories/mailing.repository';
import { InMemoryCache } from 'src/common/cache/inMemoryCache';

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
    MailingService,
    MailingRepository,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
