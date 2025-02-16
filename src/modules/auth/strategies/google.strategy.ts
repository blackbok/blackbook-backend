import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthProvider, Role } from 'src/common/utils/enum/Role';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { IUserResponse } from 'src/modules/user/dto/user-response.dto';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/model/user/user.model';

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
    done: VerifyCallback,
  ): Promise<any> {
    const logger = new Logger('GoogleStrategy');

    const { state } = request.query;
    if (!state || ![Role.USER, Role.MODERATOR].includes(state as Role)) {
      throw new UnauthorizedException('Invalid role provided');
    }

    const { emails, displayName, id, photos } = profile;
    logger.log('profile', profile);
    const email = emails[0].value;

    if (state === Role.USER) {
      let user = (await this.userService.findByEmail(email)) as IUserResponse;
      if (!user) {
        logger.debug('no user found.. creating new user');
        const username = email.split('@')[0];
        const newUser: CreateUserDto = {
          email: email,
          name: displayName,
          passwordHash: '',
          role: Role.USER,
          metadata: {
            profilePicUrl: photos[0].value,
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
            acessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
            refreshTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
          },
          username: username,
          socialMedia: {
            linkedIn: '',
            github: '',
            twitter: '',
            instagram: '',
            facebook: '',
            website: '',
            medium: '',
            behance: '',
          },
        };
        user = await this.userService.create(newUser);
        logger.log('new user created.');
      }

      const accessUser = (await this.userService.getAccessToken(
        user.id.toString(),
      )) as User;
      const { acessToken } = accessUser.authMetadata;

      if (acessToken !== accessToken && user !== null) {
        logger.log('updating access token');
        user = (await this.userService.updateAccessToken(
          new Types.ObjectId(user.id),
          accessToken,
        )) as IUserResponse;
      }

      done(null, user);
    } else {
      logger.error('Invalid role provided');
      throw new UnauthorizedException('Invalid role provided');
    }
  }
}
