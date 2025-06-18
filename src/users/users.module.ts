import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [],
  exports: [MongooseModule], // <-- ¡esto es fundamental!
})
export class UsersModule {}
