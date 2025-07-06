// src/users/users.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) {}

  async findAll() {
    return this.userModel.find().select('-password');
  }

  async create(registerDto: RegisterDto) {
    const user = new this.userModel({
      ...registerDto,
      isActive: true, // por defecto activo
    });
    return user.save();
  }

  async disable(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuario deshabilitado', user };
  }

  async enable(id: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: true }, { new: true });
    if (!user) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: 'Usuario habilitado', user };
  }
}
