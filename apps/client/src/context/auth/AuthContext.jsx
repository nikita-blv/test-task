import { createContext, useContext, useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { api } from '@root/shared/api';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import io from "socket.io-client";
import { env } from "@root/shared/env.js";
import { getAccessToken } from "@root/shared/session.js";

const ReactAuthContext = createContext({});

export const AuthContext = ({ children }) => {
    const [isInitLoading, setInitLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);

    const signIn = (user) => {
        setUser(user);
        setIsAuthenticated(true);
        const socket = io(env.baseApiUrl, {
            autoConnect: false,
            query: {
                token: getAccessToken(),
            },
        });
        socket.connect()
        setSocket(socket);
    };

    const signOut = () => {
        setUser(null);
        setIsAuthenticated(false);
        setSocket(null);
        socket.disconnect();
    };

    const loadUserMutation = useMutation({
        mutationFn: api.auth.currentUser,
        onSuccess: signIn,
        onSettled: () => {
            setInitLoading(false);
        },
    });

    useEffect(() => {
        loadUserMutation.mutate();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
            })
            socket.on('disconnect', () => {
            })
            return () => {
                socket.off('connect');
                socket.off('disconnect');
            }
        }
    }, [socket]);

    if (isInitLoading) {
        return (
            <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <ReactAuthContext.Provider
            value={{
                isAuthenticated,
                user,
                signIn,
                signOut,
                socket,
            }}
        >
            {children}
        </ReactAuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(ReactAuthContext);
