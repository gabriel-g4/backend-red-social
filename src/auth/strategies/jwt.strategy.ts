import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt} from 'passport-jwt'
import { ConfigService } from "@nestjs/config";
import { AuthService, JwtPayload } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor (private authService: AuthService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ,
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')
        })
    }
    

    async validate(payload: JwtPayload) {
        const user = await this.authService.findById(payload.sub)

        if(!user) {
            throw new UnauthorizedException("Usuario no encontrado o token invalido")
        }

        return {
            id: payload.sub,
            username: payload.username,
            roles: payload.roles || ['user']
        }
    }

    

}