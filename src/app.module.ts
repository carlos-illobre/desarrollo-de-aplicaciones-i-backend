import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { RoutesModule } from './modules/routes/routes.module';
import { EntregasModule } from './modules/entregas/entrega.module';

@Module({
  imports: [AuthModule, RoutesModule, EntregasModule],
})
export class AppModule {}
