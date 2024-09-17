import { verify, decode } from '#root/shared/utils/jwt.js';
import {
    createOnlineSession,
    deleteOnlineSession,
    getSessionIfExist,
} from '#root/services/session.js';
import { Server } from 'socket.io';

const connectSocket = (io) => {
    io.use((socket, next) => {
        const token = socket.handshake.query?.token;
        if (!token) {
            next(new Error('Authentication error'));
        }
        const decoded = decode(socket.handshake.query.token);
        if (
            !verify(token) ||
            !getSessionIfExist(decoded.sessionId, decoded.userId)
        ) {
            next(new Error('Authentication error'));
        }
        socket.decoded = decoded;
        next();
    }).on('connection', (socket) => {
        const { sessionId } = socket.decoded ?? { };
        if (sessionId) {
            createOnlineSession(sessionId);
            socket.join(sessionId);
            socket.on('disconnect', () => {
                deleteOnlineSession(sessionId);
                socket.leave();
            });
        }
    });
};

let io;

export const createSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
        },
    });
    connectSocket(io);
    return io;
};

export const getIo = () => io;
