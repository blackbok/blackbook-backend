
export interface AppConfig {
    app: {
        port: number;
        env: string;
        sessionSecret?: string;
        jwt_acesstoken_secret?: string;
        jwt_refreshtoken_secret?: string;
        corsOrigin?: string ;
        frontendDomain: string;

        database: {
            monogodb: {
                uri?: string;
            }
        };
        google: {
            clientId: string;
            clientSecret: string;
            callbackUrl: string;
        };
        cloudinary: {
            cloud_name: string;
            api_key: string;
            api_secret: string;
        }
    };

}

const getDatabaseConfig = () => ({
    monogodb: {
        uri: process.env.MONGODB_URI,
    },
});

const getGoogleConfig = () => ({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
});

const getCloudinaryConfig = () => ({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

export const appConfig = (): AppConfig => ({
    app: {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
        sessionSecret: process.env.SESSION_SECRET,
        jwt_acesstoken_secret: process.env.JWT_ACCESSTOKEN_SECRET,
        jwt_refreshtoken_secret: process.env.JWT_REFRESH_SECRET,
        corsOrigin: process.env.CORS_ORIGIN,
        frontendDomain: process.env.FRONTEND_DOMAIN || 'http://localhost:3000',
        database: getDatabaseConfig(),
        google: getGoogleConfig(),
        cloudinary: getCloudinaryConfig(),
    },
});