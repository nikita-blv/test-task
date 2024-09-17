import express from "express";
import { authMiddleware } from "#root/middelwares/auth.js";
import { lootBoxService } from "#root/services/lootBox.js";
import { getIo } from "#root/shared/socket.js";

const lootBoxRouter = express.Router();


const getActiveLootBoxes = async (req, res) => {
    const lootBoxes = await lootBoxService.getOrPopulateLootBoxes()
    res.status(200).send({
        lootBoxes
    })
}

const openLootBox = async (req, res) => {
    try {
        const { id, username, sessionId } = req.user
        const { lootBoxId } = req.body
        const data = await lootBoxService.openUserLootBox(id, lootBoxId, username)
        const io = getIo()
        io.except(sessionId).emit('lootBoxOpened', data)
        res.status(200).send(data)
    } catch (e) {
        res.status(400).send({
            message: 'Unable to open loot box'
        })
    }
}

lootBoxRouter.use(authMiddleware)
lootBoxRouter.get("/active", getActiveLootBoxes);
lootBoxRouter.post("/open", openLootBox);

export const lootBoxController = lootBoxRouter