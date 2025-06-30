import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import {JwtStrategy} from './strategies/jwt.strategy';
import {JwtAuthGuard} from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenController } from './controllers/token.controller';
import { PassportModule } from '@nestjs/passport';



@Module({
  imports: [
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema}
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }), 
    JwtModule.registerAsync({
      imports: [ConfigModule],  // si usas ConfigService para la configuración JWT
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' }, // 15 minutos de expiración
      }),
    }),
    ConfigModule
  ],
  controllers: [AuthController, TokenController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
