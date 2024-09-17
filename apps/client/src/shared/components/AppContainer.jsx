import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { styled } from "@mui/material/styles";
import { Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { routes } from '@root/routes/routes.js';
import { useAuthContext } from '@root/context/auth/AuthContext';

const AppContentContainer = styled(Box)`
    display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  min-height: calc(100vh - 64px);
`;

export const AppContainer = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    return (
        <>
            <Box sx={{ flexGrow: 1, height: '64px', display: 'flex', justifyContent: 'center' }}>
                <AppBar position="static" sx={{ height: '100%', gap: '10px' }}>
                    <Toolbar sx={{ gap: '10px' }}>
                        { !isAuthenticated && (
                            <>
                                <Typography variant="h6" component="div">
                                    <NavLink to={routes.signIn}>
                                        Sign In
                                    </NavLink>
                                </Typography>
                                <Typography variant="h6" component="div">
                                    <NavLink to={routes.signUp}>
                                        Sign Up
                                    </NavLink>
                                </Typography>
                            </>
                        )}
                        { isAuthenticated && (
                            <>
                                <Typography variant="h6" component="div">
                                    <NavLink to={routes.lootBoxes}>
                                        Loot Boxes
                                    </NavLink>
                                </Typography>
                            </>
                        )}
                    </Toolbar>
                </AppBar>
            </Box>
            <AppContentContainer>
                {children}
            </AppContentContainer>
        </>
    );
};
