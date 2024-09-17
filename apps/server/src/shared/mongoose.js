import mongoose from 'mongoose';
import { env } from '#root/shared/env.js';

export const connectMongo = async () => {
    await mongoose.connect(`${env.mongoDb.protocol}://${env.mongoDb.username}:${env.mongoDb.password}@${env.mongoDb.host}`);
};

export const runTransaction = async (callback) => {
    const session = await mongoose.startSession();
    await session.startTransaction();
    try {
        const data = await callback(session)
        await session.commitTransaction();
        return data;
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        throw error;
    } finally {
        await session.endSession();
    }
}