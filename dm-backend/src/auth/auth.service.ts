import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !user.isAdmin) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  login(user: any) {
    const payload = { sub: user._id.toString(), isAdmin: user.isAdmin };
    return { access_token: this.jwtService.sign(payload) };
  }

  googleLogin(user: any) {
    return { ...this.login(user), user: { id: user._id, username: user.username, email: user.email } };
  }
}
