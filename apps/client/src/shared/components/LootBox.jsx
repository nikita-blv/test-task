import { Button, Card, CardMedia, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { green, yellow, blue } from '@mui/material/colors';
import { useMutation } from '@tanstack/react-query';
import { api } from '@root/shared/api';
import { useAuthContext } from '@root/context/auth/AuthContext';
import { useLootBoxOpened } from "@root/shared/hooks/useLootBoxOpened.js";

const LootBoxContainer = styled(Card)`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    flex: 1 0 50%;
    border: 1px solid ${green[500]};
`;

const LootBoxItemsContainer = styled(Box)`
    display: flex;
    gap: 10px;
    padding: 10px;
`;

const LootBoxItem = styled(Card, {shouldForwardProp:(prop) => !['isOpenedByCurrentUser', 'isOpened'].includes(prop)})`
    flex: 1 0 31%;
    border: 1px solid
        ${({ isOpenedByCurrentUser, isOpened }) =>
            isOpenedByCurrentUser && isOpened
                ? green[500]
                : isOpened
                  ? yellow[500]
                  : blue[500]};
`;

export const LootBox = ({ lootBoxId, meta, resultItem, userOpened }) => {
    const handleLootBoxOpened = useLootBoxOpened()
    const { user } = useAuthContext();
    const open = useMutation({
        mutationFn: () => api.lootBox.openLootBox(lootBoxId),
        onSuccess: handleLootBoxOpened
    });

    return (
        <LootBoxContainer>
            <CardMedia
                sx={{ width: '100%', height: '250px' }}
                image={meta.imageUrl}
            />
            <Typography gutterBottom variant="h5" component="div">
                {meta.title} {!!resultItem && <small>(opened)</small>}
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => open.mutate()}
                disabled={!!resultItem}
            >
                Open
            </Button>
            <LootBoxItemsContainer>
                {meta.items.map((item) => (
                    <LootBoxItem
                        key={item.slug}
                        isOpened={item.slug === resultItem}
                        isOpenedByCurrentUser={user.username === userOpened}
                    >
                        <CardMedia
                            sx={{ width: '100%', height: '100px' }}
                            image={item.imageUrl}
                        />
                        <Typography variant="body2">{item.title}</Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'text.secondary', fontSize: '12px' }}
                        >
                            Probability: {item.variationPercentage}%
                        </Typography>
                    </LootBoxItem>
                ))}
            </LootBoxItemsContainer>
        </LootBoxContainer>
    );
};
