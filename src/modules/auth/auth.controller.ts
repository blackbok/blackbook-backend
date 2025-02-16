import {
    Controller,
    Get,
    Logger,
    Query,
    Req,
    Res,
    UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Role } from 'src/common/utils/enum/Role';
import { UserService } from '../user/user.service';
import { IUserResponse } from '../user/dto/user-response.dto';
import { User } from 'src/model/user/user.model';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        // private readonly jwtService: JwtService
    ) { }

    @Get('login')
    async googleLogin(@Query('role') query: string, @Res() res: any) {
        const role = query;
        const logger = new Logger('GoogleLogin');
        logger.log('role', role);
        try {
            if (!role || ![Role.USER, Role.MODERATOR].includes(role as Role)) {
                return res.status(400).json({ message: 'Invalid role provided' });
            }

            const authUrl =
                `https://accounts.google.com/o/oauth2/v2/auth?` +
                `response_type=code&` +
                `client_id=${this.configService.get('app.google.clientId')}&` +
                `redirect_uri=${encodeURIComponent(this.configService.get('app.google.callbackUrl') || '')}&` +
                `scope=${encodeURIComponent('email profile')}&` +
                `state=${role}`;
            // logger.log("authUrl", authUrl);

            return res.json({ googleAuthUrl: authUrl });
        } catch (error) {
            logger.error('Error during Google login initialization:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(
        @Req() req: Request,
        @Res() res: Response,
        @Query('state') role: string,
    ) {
        const logger = new Logger('GoogleRedirect');
        logger.log('role', role);

        if (!role || ![Role.USER, Role.MODERATOR].includes(role as Role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        if (role === Role.USER) {
            const user = req.user as IUserResponse;
            // logger.log("user", user);

            const newUser: User | null = await this.userService.getAccessToken(
                user.id.toString(),
            );
            if (!newUser) {
                return res.status(400).json({ message: 'User not found' });
            }

            const { acessToken } = newUser.authMetadata;

            const cookieSettings = {
                name: 'access_token',
                value: acessToken,
                httpOnly: this.configService.get('app.env') === 'production',
                secure: this.configService.get('app.env') === 'production',
                sameSite:
                    this.configService.get('app.env') === 'production' ? 'none' : 'lax',
                maxAge: 60 * 60 * 1000, // 1 hour
                path: '/',
            };

            res.cookie(cookieSettings.name, cookieSettings.value, {
                httpOnly: cookieSettings.httpOnly,
                secure: cookieSettings.secure,
                sameSite: cookieSettings.sameSite as 'strict' | 'lax' | 'none',
                maxAge: cookieSettings.maxAge,
                path: cookieSettings.path,
            });

            const redirectUrl = `${this.configService.get('app.corsOrigin')}/auth/success`;

            return res.redirect(redirectUrl);
        } else {
            return res.status(400).json({ message: 'Invalid role provided' });
        }
    }

    @Get('verify')
    async verifyAuth(@Req() req: Request) {
        const { user } = req;
        return user;
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        this.logger.log('Logging out user');
        res.clearCookie('access_token');
        return res.status(200).json({ message: 'Logged out successfully' });
    }
}
