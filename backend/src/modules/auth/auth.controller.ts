import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates Google OAuth redirect
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthCallback(@Req() req) {
    return { user: req.user };
  }
}
