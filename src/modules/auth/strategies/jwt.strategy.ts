import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    private logger = new Logger(JwtStrategy.name);
    
    constructor(
        private configService: ConfigService,
        private userService: UserService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    const token = request?.cookies?.accessToken;
                    this.logger.log(`Extracted Token: ${token}`);
                    return token;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.get('app.jwt_acesstoken_secret'),
        });
        this.logger.log('JWT Strategy initialized with secret:', !!configService.get('app.jwt_acesstoken_secret'));
    }

    async validate(payload: any) {
        this.logger.debug('Validating payload:', payload);
        
        if (!payload.sub && !payload.userId) {
            this.logger.error('No user ID in payload');
            throw new UnauthorizedException('Invalid token payload');
        }

        const userId = payload.sub || payload.userId;
        const user = await this.userService.findById(userId);
        
        this.logger.log(`User validated:`, user);

        if (!user) {
            this.logger.error(`User not found for ID: ${userId}`);
            throw new UnauthorizedException('User not found');
        }

        // Return a clean user object
        return user;
    }
}