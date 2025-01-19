import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";
import { UserModule } from "../user/user.module";




@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'google' }),
        // JwtModule.registerAsync({
        //     imports: [ConfigModule],
        //     inject: [ConfigService],
        //     useFactory: (configService: ConfigService) => ({
        //         secret: configService.get('app.jwt_accesstoken_secret'),
        //         signOptions: { expiresIn: '15m' },
        //     }),
        // }),
        UserModule,
    ],
    providers: [
        GoogleStrategy,
        // JwtStrategy,

    ],
    exports: [
        PassportModule,
        GoogleStrategy,
        // JwtStrategy,
        // JwtModule,
    ],
    controllers: [AuthController],
})
export class AuthModule { }