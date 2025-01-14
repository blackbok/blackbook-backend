import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";
import { UserModule } from "../user/user.module";
import { AuthService } from "./auth.service";



@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google' }),
        UserModule,
    ],
    providers: [
        GoogleStrategy,
        AuthService,

    ],
    exports: [
        PassportModule,
        GoogleStrategy,
    ],
    controllers: [AuthController],
})
export class AuthModule { }