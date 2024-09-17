import { decode, getToken, verify } from '#root/shared/utils/jwt.js';
import { userDao } from '#root/dao/user.js';
import { getSessionIfExist } from "#root/services/session.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const accessToken = getToken(req.get('x-access-token'));

        const { userId, sessionId } = decode(accessToken);

        const session = getSessionIfExist(sessionId, userId)

        if (!session) {
            return res.status(401).send({
                code: 'error_on_refresh',
                message: 'unable to refresh',
            })
        }

        const isTokenValid = verify(accessToken);
        if (isTokenValid) {
            const user = await userDao.findById(userId);
            req.user = {
                id: user.id,
                username: user.username,
                sessionId,
            };
            next();
        } else {
            return res.status(401).send({
                code: 'unauthorized',
                message: 'Unauthorized',
            });
        }
    } catch (e) {
        return res.status(401).send({
            code: 'unauthorized',
            message: 'Unauthorized',
        });
    }
};
