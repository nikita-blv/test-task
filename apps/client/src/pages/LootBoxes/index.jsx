import { AppContainer } from '@root/shared/components/AppContainer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@root/shared/api';
import { LOOT_BOXES } from '@root/shared/constants';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { LootBox } from '@root/shared/components/LootBox.jsx';
import { useEffect } from "react";
import { useLootBoxOpened } from "@root/shared/hooks/useLootBoxOpened.js";
import { useAuthContext } from "@root/context/auth/AuthContext.jsx";
import { toast } from 'react-toastify';

const LootBoxContainer = styled(Box)`
    display: flex;
    gap: 20px;
    max-width: 600px;
    flex-grow: 1;
`;

export const LootBoxes = () => {
    const { socket } = useAuthContext()
    const { data: lootBoxesResponse } = useQuery({
        queryFn: api.lootBox.getActiveLootBoxes,
        queryKey: [LOOT_BOXES],
    });
    const handleLootBoxOpened = useLootBoxOpened();

    const queryClient = useQueryClient()

    useEffect(() => {
        socket?.on('lootBoxOpened', (data) => {
            handleLootBoxOpened(data)
        });
        return () => {
            socket?.off('lootBoxOpened')
        }
    }, [socket]);

    useEffect(() => {
        socket?.on('lootBoxesUpdated', (lootBoxes) => {
            queryClient.setQueryData([LOOT_BOXES], { lootBoxes });
            toast('Loot boxes updated');
        });
        return () => {
            socket?.off('lootBoxesUpdated')
        }
    }, [socket]);

    if (!lootBoxesResponse) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AppContainer>
            <LootBoxContainer>
                {lootBoxesResponse.lootBoxes.map((lootBox) => (
                    <LootBox
                        key={lootBox.id}
                        meta={lootBox.meta}
                        resultItem={lootBox.resultItem}
                        userOpened={lootBox.userOpened}
                        lootBoxId={lootBox.id}
                    />
                ))}
            </LootBoxContainer>
        </AppContainer>
    );
};
