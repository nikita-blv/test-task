import mongoose from 'mongoose';

const GameLootBoxSchema = new mongoose.Schema(
    {
        lootBoxSlug: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            required: true,
            index: true,
        },
        result: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Result',
        }
    },
)


const gameLootBoxModel = mongoose.model('GameLootBox', GameLootBoxSchema)

export const gameLootBoxDao = {
    getActiveLootBoxes: (session = null) => {
        return gameLootBoxModel.find({ isActive: true }).populate('result').populate({ path:'result', populate: ['user'] }).session(session)
    },
    populateNewLootBoxes: (lootBoxesSlugs, session = null) => {
        return gameLootBoxModel.insertMany(lootBoxesSlugs.map((slug) => ({
            lootBoxSlug: slug,
            isActive: true,
        }), { session }))
    },
    getLootBoxById: (id, session = null) => {
        return gameLootBoxModel.findById(id).session(session).populate('result').exec()
    },
    setLootBoxOpened: (id, resultId, session) => {
        return gameLootBoxModel.findByIdAndUpdate(id, { result: resultId }, { session })
    },
    expireCurrentLootBoxes: (session) => {
        return gameLootBoxModel.updateMany({ isActive: true }, { isActive: false }, { session })
    }
}