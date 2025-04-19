import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { RoutesModule } from './modules/routes/routes.module';

@Module({
  imports: [AuthModule, RoutesModule],
})
export class AppModule {}
