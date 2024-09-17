import { useQueryClient } from "@tanstack/react-query";
import { LOOT_BOXES } from "@root/shared/constants";
import { useAuthContext } from "@root/context/auth/AuthContext.jsx";
import { toast } from "react-toastify";

export const useLootBoxOpened = () => {
    const queryClient = useQueryClient()
    const { user } = useAuthContext()

    return (data) => {
        queryClient.setQueryData([LOOT_BOXES], {lootBoxes: data.newLootBoxes} )
        if (user.username !== data.userIdLootBoxOpened) {
            toast(`User ${data.userIdLootBoxOpened} opened loot box`);
        }
        toast(`Loot box ${data.openedLootBox.lootBoxData.title} was opened and earned ${data.openedLootBox.openedItem.title}`);
    }
}