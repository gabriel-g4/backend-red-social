import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from './users.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule
  ],
  
  providers: [UsersService],
  exports: [MongooseModule],
  controllers: [UsersController],
})
export class UsersModule {}
