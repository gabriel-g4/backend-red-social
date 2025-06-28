import { Controller, Post, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { extname } from 'path';
import { FileValidationPipe } from 'src/common/pipes/file-validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

   @Post('register')
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
}
