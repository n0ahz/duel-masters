import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const UserSchema = new mongoose.Schema({
  googleId: String,
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  passwordHash: String,
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/duel-masters';
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const UserModel = mongoose.model('User', UserSchema);

  const existingAdmin = await UserModel.findOne({ isAdmin: true });
  if (existingAdmin) {
    console.log('Admin user already exists, skipping seed');
    await mongoose.disconnect();
    return;
  }

  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  const username = process.env.ADMIN_USERNAME || 'admin';

  await UserModel.create({
    username,
    email: 'admin@duel-masters.local',
    passwordHash,
    isAdmin: true,
  });

  console.log(`Admin user "${username}" created`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
