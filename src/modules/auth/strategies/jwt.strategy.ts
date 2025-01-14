import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/common/utils/enum/Role';
import { User } from 'src/model/user/user.model';


export interface JwtPayload {
    username: string;
    email: string;
    role: Role;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private readonly logger = new Logger(JwtStrategy.name);
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('app.jwtSecret'),
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        if (!payload || !payload.username || !payload.email) {
            this.logger.warn('Invalid token payload');
            throw new UnauthorizedException('Invalid token');
        }
        this.logger.log(`Validated payload: ${JSON.stringify(payload)}`);
        return payload as User;
    }
}