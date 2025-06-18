import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSchema } from 'src/users/schemas/user.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
