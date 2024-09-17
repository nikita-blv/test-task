import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
    {
        lootBoxSlug: {
            type: String,
            required: true,
            index: true,
        },
        itemSlug: {
            type: String,
            required: true,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        gameLootBox: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'GameLootBox',
            required: true,
        }
    },
)

const ResultModel = mongoose.model('Result', ResultSchema)

export const resultDao = {
    createResult: async (
        { userId, gameLootBoxId, itemSlug, lootBoxSlug },
        session,
    ) => {
        // transactions not working when pass values not as an array
        return (await ResultModel.create([{ user: userId, gameLootBox: gameLootBoxId, itemSlug, lootBoxSlug }], { session }))[0]
    },
};