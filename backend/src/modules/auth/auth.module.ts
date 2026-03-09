import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [PassportModule, UsersModule],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
