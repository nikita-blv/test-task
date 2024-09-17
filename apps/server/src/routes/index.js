import express from 'express';
import { authController } from "#root/routes/controllers/auth.js";
import { lootBoxController } from "#root/routes/controllers/lootBox.js";

// all app routes
const appRouter = express.Router();
appRouter.use('/auth', authController)
appRouter.use('/loot-box', lootBoxController)

export { appRouter };