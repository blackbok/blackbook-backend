import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthProvider, Role } from 'src/common/utils/enum/Role';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { IUserResponse } from 'src/modules/user/dto/user-response.dto';
import { UserService } from 'src/modules/user/user.service';


@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,

    ) {
        super({
            clientID: configService.get('app.google.clientId'),
            clientSecret: configService.get('app.google.clientSecret'),
            callbackURL: configService.get('app.google.callbackUrl'),
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }

    async validate(
        request: any,
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback
    ): Promise<any> {
        const logger = new Logger('GoogleStrategy');
        logger.log("state", request.query.state);

        const { state } = request.query;
        if (!state || ![Role.USER, Role.MODERATOR].includes(state as Role)) {
            throw new UnauthorizedException('Invalid role provided');
        }

        const { emails, displayName, id } = profile;
        logger.log("profile", profile);
        const email = emails[0].value;

        if (state === Role.USER) {
            let user: IUserResponse = await this.userService.findByEmail(email) as IUserResponse;
            if (!user) {
                console.log("no user found.. creating new user");
                let username = email.split('@')[0];
                const newUser: CreateUserDto = {
                    email: email,
                    name: displayName,
                    passwordHash: '',
                    role: Role.USER,
                    metadata: {
                        address: {
                            city: '',
                            state: '',
                            country: '',
                            pincode: '',
                        },
                    },
                    authMetadata: {
                        authProvider: AuthProvider.GOOGLE,
                        providerId: id,
                        acessToken: accessToken,
                        refreshToken: refreshToken,
                        acessTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
                        refreshTokenExpiresAt: new Date(Date.now() + 3600 * 1000),
                    },
                    username: username,

                };
                user = await this.userService.create(newUser)
                logger.log("new user created.");
                logger.log("new user", user);
            }

            done(null, user);
        } else {
            logger.error('Invalid role provided');
            throw new UnauthorizedException('Invalid role provided');
        }
    }
}