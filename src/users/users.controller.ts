import {
  Controller, Get, Post, Delete, Body, Param, UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService, private authService: AuthService) {}


  // Listar usuarios
  @Get()
  @ApiBearerAuth()
  async getAllUsers() {
    return await this.usersService.findAll();
  }

  // Crear usuario (con imagen)
    @Post()
    @ApiBearerAuth()
    @UseInterceptors(
        FileInterceptor('imagen', {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async register(
        @Body() registerDto: RegisterDto,
        @UploadedFile(FileValidationPipe) file: Express.Multer.File,
    ) {
        const imagenPerfilUrl = file ? `/uploads/${file.filename}` : undefined;

        return this.authService.register(registerDto, imagenPerfilUrl);
    }

  // Dar de baja logica a usuario
  @Delete(':id')
  @ApiBearerAuth()
  async disableUser(@Param('id') id: string) {
    return await this.usersService.disable(id);
  }

  // Rehabilitar logicamente a usuario
  @Post(':id/rehabilitar')
  @ApiBearerAuth()
  async enableUser(@Param('id') id: string) {
    return await this.usersService.enable(id);
  }
}
