import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateGoogleUser(profile: any) {
    const { id, displayName, emails, photos } = profile;
    return this.usersService.findOrCreate({
      googleId: id,
      email: emails?.[0]?.value || '',
      displayName,
      avatarUrl: photos?.[0]?.value || '',
    });
  }
}
