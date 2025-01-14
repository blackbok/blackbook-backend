import { Body, Controller, Get, Logger, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthGuard } from "@nestjs/passport";
import { Request, Response } from "express";
import { Role } from "src/common/utils/enum/Role";
import { User } from "src/model/user/user.model";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) { }


    @Get('login')
    async googleLogin(@Query('role') query: string, @Res() res: any) {
        const role = query;
        const logger = new Logger('GoogleLogin');
        logger.log("role", role);
        try {
            if (!role || ![Role.USER, Role.MODERATOR].includes(role as Role)) {
                return res.status(400).json({ message: 'Invalid role provided' });
            }

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `response_type=code&` +
                `client_id=${this.configService.get('app.google.clientId')}&` +
                `redirect_uri=${encodeURIComponent(this.configService.get('app.google.callbackUrl') || '')}&` +
                `scope=${encodeURIComponent('email profile')}&` +
                `state=${role}`;
            logger.log("authUrl", authUrl);

            return res.json({ googleAuthUrl: authUrl });
        } catch (error) {
            logger.error('Error during Google login initialization:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: Request, @Res() res: Response, @Query('state') role: string) {
        const logger = new Logger('GoogleRedirect');
        logger.log("role", role);

        if (!role || ![Role.USER, Role.MODERATOR].includes(role as Role)) {
            return res.status(400).json({ message: 'Invalid role provided' });
        }

        if (role === Role.USER) {
            const user: User = req.user as User;
            return this.authService.userGoogleRedirect(user, res);
        } else {
            return res.status(400).json({ message: 'Invalid role provided' });
        }
    }

    @Post('/verify-session')
    verifySession(@Body() body: { sessionToken: string }, @Res() res: any) {
        const logger = new Logger('VerifySession');
        logger.log("body", body);

        if (!body.sessionToken) {
            return res.status(400).json({ message: 'Invalid session token' });
        }

        return res.status(200).json({ message: 'Session verified' });
    }

}