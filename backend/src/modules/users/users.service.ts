import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findOrCreate(profile: {
    googleId: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  }): Promise<UserDocument> {
    const existing = await this.userModel
      .findOne({ googleId: profile.googleId })
      .exec();
    if (existing) {
      existing.displayName = profile.displayName;
      existing.avatarUrl = profile.avatarUrl;
      return existing.save();
    }
    return this.userModel.create(profile);
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument> {
    return this.userModel.findOne({ googleId }).exec();
  }
}
