import { Injectable, Logger } from "@nestjs/common";
import { User } from "src/model/user/user.model";
import { ConfigService } from "@nestjs/config";


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        private configService: ConfigService,
    ) { }

    async userGoogleRedirect(user: User, res: any): Promise<string> {
        this.logger.log('User logged in:', user);

        res.cookie('session_token', { id: user._id, username: user.username, role: user.role }, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });


        const redirectUrl = `${this.configService.get("app.corsOrigin")}/user/dashboard`;
        this.logger.log('Redirecting to:', redirectUrl);
        return res.redirect(redirectUrl);
    }
}