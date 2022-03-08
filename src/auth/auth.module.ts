import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import SharedModule from 'src/shared/shared.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UserModule,
    SharedModule,
    ConfigModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
