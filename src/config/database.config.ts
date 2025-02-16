export interface DatabaseConfig {
  database: {
    monogodb: {
      uri?: string;
    };
  };
}

export const databaseConfig: DatabaseConfig = {
  database: {
    monogodb: {
      uri: process.env.MONGODB_URI,
    },
  },
};
