import { urls } from "./urls.js";

export class LootBox {
    constructor(client) {
        this.client = client;
    }

    getActiveLootBoxes = async () => {
        return (await this.client.get(urls.allLootBoxes))
            .data;
    }

    openLootBox = async (lootBoxId) => {
        return (await this.client.post(urls.openLootBoxes, { lootBoxId }))
            .data;
    }
}