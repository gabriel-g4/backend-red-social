import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, Logger } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes } from "@nestjs/swagger"
import { JwtService } from "@nestjs/jwt"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { User, UserDocument } from "src/users/schemas/user.schema"
import { TokenDto } from '../dto/token.dto';
import { timestamp } from "rxjs"

@ApiTags('Auth')
@Controller('auth')
export class TokenController {
    private readonly logger = new Logger(TokenController.name)

    constructor(
        private readonly jwtService: JwtService,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    @Post('autorizar')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/json')
    @ApiOperation({
        summary: "Validar token y obtener datos de usuario",
        description: "Verifica si un token JWT es valido y devuelve los datos del usuari.Retorna 401 si el token es invalido o esta expirado."
    })
    @ApiBody({
        type: TokenDto,
        description: 'Token JWT a validar',
        examples: {
            validToken: {
                summary: 'Token JWT valido',
                value: {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlcm5hbWUiOiJqZG9lIiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE2MjYyMDAwMDAsImV4cCI6MTYyNjIwMzYwMH0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'}
            }
        }
    })
    async authorize(@Body() tokenDto: TokenDto) {
        try {
            const {token} = tokenDto

            // paso 1: verificar token
            const payload = this.jwtService.verify(token)
            this.logger.debug('token verificado correctamente')

            // paso 2: token con id
            const userId = payload.sub;
            if (!userId) {
                this.logger.warn("Token sin identificador de usuario (sub)")
                throw new UnauthorizedException('Token con estructura invalida')
            }

            // paso 3: verificar que el usuario exista
            const user = await this.userModel.findById(userId).select('-password -__v').exec()

            if (!user) {
                this.logger.warn('Usuario no encontrado en la base de datos')
                throw new UnauthorizedException('Token valido pero no se encontro el usuario.')
            }

            // paso 4
            const userData = user.toObject ? user.toObject(): user;

            return {
                success: true,
                message: 'Token valido',
                data: {
                    id:userData._id,
                    username: userData.username,
                    email: userData.email,
                    nombre: userData.nombre,
                    apellido: userData.apellido,
                    roles: userData.tipoPerfil || ['user'],
                },
                timestamp: new Date().toISOString()
            }
        } catch (error) {
            
            if(error.name == 'TokenExpiredError') {
                throw new UnauthorizedException("El token se expiro.")
            }
        }
    }

    @Post('refrescar')
    @HttpCode(HttpStatus.OK)
    @ApiConsumes('application/json')
    @ApiOperation({
        summary: "Refrescar un token JWT válido",
        description: "Devuelve un nuevo token con la misma información del payload, pero con expiración renovada (15 minutos)."
    })
    @ApiBody({
        type: TokenDto,
        description: 'Token JWT a refrescar',
    })
    async refresh(@Body() tokenDto: TokenDto) {
        try {
            const { token } = tokenDto;

            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
                ignoreExpiration: false,
            });

            if (!payload?.sub || !payload?.username) {
                this.logger.warn("El token no contiene información suficiente para renovarlo");
                throw new UnauthorizedException("Token inválido.");
            }

            const newToken = this.jwtService.sign(
                {
                    sub: payload.sub,
                    username: payload.username,
                    roles: payload.roles || ['user'],
                },
                {
                    secret: process.env.JWT_SECRET,
                    expiresIn: '15m',
                },
            );

            return {
                success: true,
                message: 'Token refrescado correctamente',
                accessToken: newToken,
                expiresIn: 15 * 60,
                timestamp: new Date().toISOString(),
            };

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                this.logger.warn("Token expirado, no puede refrescarse");
                throw new UnauthorizedException('El token ha expirado y no puede ser refrescado.');
            }
            throw new UnauthorizedException('Token inválido.');
        }
    }
}