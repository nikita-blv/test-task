import { hashPassword, matchPassword } from "#root/shared/utils/password.js";
import { createUserSession, getSessionIfExist, refreshUserSession } from "#root/services/session.js";
import { decode, getToken } from "#root/shared/utils/jwt.js";
import { userDao } from "#root/dao/user.js";
import express from "express";
import { authMiddleware } from "#root/middelwares/auth.js";

const signUp = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(403).send({
            code: 'invalid_payload',
            message: 'Username and password are required',
        })
    }

    const { hash, salt } = hashPassword(password)

    try {

        const user = await userDao.createUser(username, hash, salt);

        const { refreshToken, accessToken } = createUserSession(user.id);

        res.status(200).send({
            refreshToken,
            accessToken,
            user: {
                id: user.id,
                username: user.username,
            }
        })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(403).send({
                code: 'duplicate_entry',
                message: 'username already used',
            })
        }
        res.status(403).send({
            code: 'error_on_create',
            message: 'unable to create entry',
        })
    }
}

const signIn = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(401).send({
            code: 'invalid_payload',
            message: 'Username and password are required',
        })
    }

    try {

        const user = await userDao.findByUsername(username);

        if (!matchPassword(password, user.password.hash, user.password.salt)) {
            return res.status(401).send({
                code: 'wrong_password',
                message: 'Wrong password',
            })
        }

        const { refreshToken, accessToken } = createUserSession(user.id);

        res.status(201).send({
            refreshToken,
            accessToken,
            user: {
                id: user.id,
                username: user.username,

            }
        })
    } catch (error) {
        res.status(401).send({
            code: 'error_on_login',
            message: 'unable to find entry',
        })
    }
}

const refresh = async (req, res) => {

    try {
        const { refreshToken } = req.body;
        const accessToken = getToken(req.get('x-access-token'));

        if (!accessToken || !refreshToken) {
            res.status(401).send({
                code: 'invalid_payload',
                message: 'Invalid payload',
            })
        }
        const { sessionId, userId } = decode(accessToken);

        const session = getSessionIfExist(sessionId, userId)

        if (session.refreshToken !== refreshToken) {
            return res.status(401).send({
                code: 'error_on_refresh',
                message: 'unable to refresh',
            })
        }

        const { refreshToken: newRefreshToken, accessToken: newAccessToken } = refreshUserSession(sessionId);

        res.status(201).send({
            refreshToken: newRefreshToken,
            accessToken: newAccessToken
        })
    } catch (error) {
        res.status(401).send({
            code: 'error_on_refresh',
            message: 'unable to refresh',
        })
    }
}

const currentSession = async (req, res) => {
    try {
        const { id, username } = req.user

        res.status(201).send({
            id,
            username
        })
    } catch (error) {
        return res.status(401).send({
            code: 'unauthorized',
            message: 'Unauthorized',
        })
    }
}

const authRouter = express.Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/refresh', refresh);
authRouter.get('/current-user', authMiddleware, currentSession);


export const authController = authRouter