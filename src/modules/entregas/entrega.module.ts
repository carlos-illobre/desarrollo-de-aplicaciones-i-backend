import { Module } from '@nestjs/common';
import { EntregaController } from "./entregaController";
import { EntregaService } from "./repositories/entregaService";
import { EntregaRepository } from "./repositories/entregaRepository";
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../common/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';

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
    controllers: [EntregaController],
    providers: [{
          provide: APP_GUARD,
          useClass: AuthGuard,
        },
        EntregaService,
        EntregaRepository
    ],
  })
  export class EntregasModule {}
  