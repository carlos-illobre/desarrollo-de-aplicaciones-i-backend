import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { RoutesModule } from './modules/routes/routes.module';

@Module({
  imports: [AuthModule, RoutesModule, ConfigModule.forRoot()],
})
export class AppModule {}
