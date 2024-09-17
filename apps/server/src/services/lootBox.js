// todo: move it to DB and add ability to modify cases and their items
import { gameLootBoxDao } from '#root/dao/gameLootBox.js';
import { runTransaction } from '#root/shared/mongoose.js';
import { resultDao } from '#root/dao/result.js';
import { getIo } from '#root/shared/socket.js';

const LOOT_BOXES = {
    case1: {
        title: 'Pirate Case',
        imageUrl:
            'https://media.istockphoto.com/id/502126600/photo/pirates-chest.jpg?s=612x612&w=0&k=20&c=0lsj2kGR3StAkQ8UorcVanyB44N_LPqvfcxAJijtKWY=',
        items: [
            {
                slug: 'gold-coin',
                title: 'Gold coin',
                variationPercentage: 10,
                imageUrl:
                    'https://st.depositphotos.com/1203063/4048/i/450/depositphotos_40481065-stock-photo-coin.jpg',
            },
            {
                slug: 'silver-coin',
                title: 'Silver coin',
                variationPercentage: 30,
                imageUrl:
                    'https://img.freepik.com/premium-photo/silver-coin-with-leaf-pattern-it-is-black-background_1282598-67915.jpg?w=2000',
            },
            {
                slug: 'bronze-coin',
                title: 'Bronze coin',
                variationPercentage: 60,
                imageUrl:
                    'https://img.freepik.com/free-photo/closeup-old-russian-coin-wooden_155003-9982.jpg?t=st=1726492212~exp=1726495812~hmac=95ac9e73b69be536b2558c010c2eb7758fc5738eaf24491022d6090a829159e6&w=2000',
            },
        ],
    },
    case2: {
        title: 'CS Case',
        imageUrl:
            'https://cdn.csgoskins.gg/public/uih/items/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbl9jYXNlcy9jcmF0ZV9jb21tdW5pdHlfMzMuMTUxY2FlYWFhMTk3NDI2NzU5ZmY1M2QyNWVjMjJiMjRhOTllYWIwMC5wbmc-/auto/auto/85/notrim/77126c1027dcd59fc3691e642808608b.webp',
        items: [
            {
                slug: 'ak',
                title: 'AK skin',
                variationPercentage: 5,
                imageUrl:
                    'https://cdn.csgoskins.gg/public/uih/items/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl9hazQ3X2FrX3BvcmNlbGFpbl9saWdodC5kYzRmNzZmYzM2NTE3NWU0YWM0MmQxNGVhODQ3MmQ3NmNmM2ZhNjYzLnBuZw--/auto/auto/85/notrim/66286698568f34224b86256f3790dbad.webp',
            },
            {
                slug: 'usp-pistol',
                title: 'Pistol skin',
                variationPercentage: 20,
                imageUrl:
                    'https://cdn.csgoskins.gg/public/uih/items/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl91c3Bfc2lsZW5jZXJfdXNwc19kb2dneV9saWdodC4wM2NkNGIxMWUzYzA4MjhiNjllZDM0YTYxN2YyNmRlMmFhYjBjMThiLnBuZw--/auto/auto/85/notrim/2c9cfcaf6c208396684ea8e1eabe2806.webp',
            },
            {
                slug: 'gun',
                title: 'Gun skin',
                variationPercentage: 75,
                imageUrl:
                    'https://cdn.csgoskins.gg/public/uih/items/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3dlYXBvbl9tYWMxMF9tYWMxMF9pbGx1c2lvbl9saWdodC5iZDVhY2JlMjNjMTZjY2E0NDJjMGIxYmJjNTAyOTViM2QxYTQxODNmLnBuZw--/auto/auto/85/notrim/2ba61e8eba73965404d3ee42cd4288b1.webp',
            },
        ],
    },
};

let isLootBoxesPopulationStarted = false;

class LootBoxService {
    #getLootBoxMetaInfo = (slug) => LOOT_BOXES[slug];
    #openLootBox = (slug) => {
        const lootBox = this.#getLootBoxMetaInfo(slug);
        if (!lootBox) {
            throw new Error('No lootBox specified');
        }
        const items = lootBox.items;
        const randomItem = Math.floor(Math.random() * 101);
        let acc = 0;
        return items.find((item) => {
            acc += +item.variationPercentage;
            if (acc > randomItem) {
                return true;
            } else {
                return false;
            }
        });
    };
    #mapLootBoxesResponse = (lootBoxes) => {
        return lootBoxes.map(({ id, lootBoxSlug, result }) => ({
            id,
            slug: lootBoxSlug,
            resultItem: result?.itemSlug,
            userOpened: result?.user?.username,
            meta: this.#getLootBoxMetaInfo(lootBoxSlug),
        }));
    };
    // better to set up via cron job, or even manage this from DB
    #tryScheduleRenewLootBoxes = () => {
        if (isLootBoxesPopulationStarted) {
            return
        }
        isLootBoxesPopulationStarted = true;
        setTimeout(async () => {
            try {
                const newLootBoxes = await runTransaction(async (session) => {
                    await gameLootBoxDao.expireCurrentLootBoxes(session);
                    return gameLootBoxDao.populateNewLootBoxes(
                        Object.keys(LOOT_BOXES),
                        session
                    );
                })
                const io = getIo();
                io.emit('lootBoxesUpdated', this.#mapLootBoxesResponse(newLootBoxes))
                console.log('Loot boxes updated');
            } catch (e) {
                console.log(e, 'Unable to update loot boxes');
            } finally {
                isLootBoxesPopulationStarted = false;
            }
        }, 1000 * 120)
    };
    getOrPopulateLootBoxes = async (session = null) => {
        let activeLootBoxes = await gameLootBoxDao.getActiveLootBoxes(session);
        // will be only when base will be totally clear
        if (activeLootBoxes.length === 0) {
            activeLootBoxes = await gameLootBoxDao.populateNewLootBoxes(
                Object.keys(LOOT_BOXES),
                session
            );
        }
        const isAllOpened = activeLootBoxes.every(({result}) => !!result)
        if (isAllOpened) {
            this.#tryScheduleRenewLootBoxes()
        }
        return this.#mapLootBoxesResponse(activeLootBoxes)
    };

    openUserLootBox = async (userId, lootBoxId, username) => {
        return runTransaction(async (session) => {
            const currentLootBox = await gameLootBoxDao.getLootBoxById(lootBoxId, session);
            if (currentLootBox.result) {
                throw new Error('Case already opened');
            }
            const openedItem = this.#openLootBox(currentLootBox.lootBoxSlug);

            const result = await resultDao.createResult({
                userId,
                gameLootBoxId: lootBoxId,
                lootBoxSlug: currentLootBox.lootBoxSlug,
                itemSlug: openedItem.slug
            }, session);
            await gameLootBoxDao.setLootBoxOpened(lootBoxId, result.id, session);
            const newLootBoxes = await this.getOrPopulateLootBoxes(session);

            return {
                newLootBoxes,
                userIdLootBoxOpened: username,
                openedLootBox: {
                    lootBoxId,
                    openedItem,
                    lootBoxData: this.#getLootBoxMetaInfo(currentLootBox.lootBoxSlug)
                }
            }
        });
    };
}

export const lootBoxService = new LootBoxService();
