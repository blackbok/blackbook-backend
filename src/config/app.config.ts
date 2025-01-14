
export interface AppConfig {
    app: {
        port: number;
        env: string;
        jwtSecret: string;
        corsOrigin: string;

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
    };
}

export const appConfig = (): AppConfig => ({
    app: {
        port: parseInt(process.env.PORT || '3000', 10),
        env: process.env.NODE_ENV || 'development',
        jwtSecret: process.env.JWT_SECRET || 'secret',
        corsOrigin: process.env.CORS_ORIGIN || '*',
        database: {
            monogodb: {
                uri: process.env.MONGODB_URI,
            },
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackUrl: process.env.GOOGLE_CALLBACK_URL || '',
        },
    },
});