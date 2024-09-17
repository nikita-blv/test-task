// TODO: use redis for session if find free way to deploy it
import { randomUUID } from 'crypto'
import { signIn } from "#root/shared/utils/jwt.js";

/**
 * @typedef {string} UserId
 * */

/**
 * @typedef {string} SessionId
 * */

/**
 * A number, or a string containing a number.
 * @typedef {Object} UserSession
 * @property {UserId} userId
 * @property {string} refreshToken
 */

/** variable to store sessions
 * @type {Object.<SessionId, UserSession>} Sessions
 * */
export const sessions = {}
export const onlineSessions = new Set()


/** variable to store sessions
 * @type {Object.<UserId, Set.<SessionId>>} Sessions
 * */
export const userSessions = {}

const removeUserSession = (sessionId, userId) => {
    if (!userSessions[userId]){
        return
    }

    userSessions[userId].delete(sessionId)

    if (userSessions[userId].size === 0) {
        delete userSessions[userId]
    }
}

const addUserSession = (sessionId, userId) => {
    if (!userSessions[userId]){
        userSessions[userId] = new Set()
    }

    userSessions[userId].add(sessionId)
}


export const createUserSession = (userId) => {
    const sessionId = randomUUID()
    const refreshToken = randomUUID()

    sessions[sessionId] = {
        userId,
        refreshToken,
    };

    addUserSession(sessionId, userId)

    return { refreshToken, accessToken: signIn({ userId, sessionId }) }
}

export const refreshUserSession = (sessionId) => {
    const refreshToken = randomUUID()

    const currentSession = sessions[sessionId]

    sessions[sessionId] = {
        ...currentSession,
        refreshToken,
    };

    addUserSession(sessionId, currentSession.userId)

    return { refreshToken, accessToken: signIn({ userId: currentSession.userId, sessionId }) }
}

export const getSessionIfExist = (sessionId, userId) => {
    if (!sessions[sessionId]){
        removeUserSession(sessionId, userId)
        return null
    }

    return sessions[sessionId]
}

export const deleteOnlineSession = (sessionId) => {
    onlineSessions.delete(sessionId)
}

export const createOnlineSession = (sessionId) => {
    onlineSessions.add(sessionId)
}

export const deleteUserSession = (sessionId, userId) => {
    delete sessions[sessionId]

    deleteOnlineSession(sessionId)

    removeUserSession(sessionId, userId)
}