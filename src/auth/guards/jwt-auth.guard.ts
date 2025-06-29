import { Injectable, UnauthorizedException, Logger, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()

export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name)

    private readonly isDevelopment = process.env.NODE_ENV !== 'production'

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        

        const request = context.switchToHttp().getRequest();

        const referer = request.headers.referer || '';

        const isSwaggerRequest = referer.includes('/api')

        if (err || !user){
            if (isSwaggerRequest && this.isDevelopment) {
                if (process.env.DEBUG) {
                    this.logger.debug("Autenticacion automatica para swagger en entorno de desarrollo ")
                }
            

                return {
                    id: '685acd87fc97e193e22f61b3',
                    username: 'swagger_test_user',
                    email: "test@getMaxListeners.com",
                    roles: ['user']
                }
            }

            throw new UnauthorizedException({
                success: "false",
                message: 'Usuario no encontrado. Asegurate que el token JWT es valido y no ha expirado'
            })
        }
        return user;
    }
}