export const env = {
    port: process.env.PORT,
    mongoDb: {
        username: process.env.MONGO_USERNAME,
        password: process.env.MONGO_PASSWORD,
        protocol: process.env.MONGO_PROTOCOLL,
        host: process.env.MONGO_HOST,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRES_IN,
    }
};
