import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleAuth() {
    // redirects to Google consent screen
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  googleCallback(@Request() req: any) {
    return this.authService.googleLogin(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('admin/login')
  adminLogin(@Request() req: any) {
    return this.authService.login(req.user);
  }
}
