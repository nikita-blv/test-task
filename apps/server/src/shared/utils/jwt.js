import jwt from 'jsonwebtoken'
import { env } from "#root/shared/env.js";

export const signIn = (payload) => {
    return jwt.sign(payload, env.jwt.secret, {
        expiresIn: env.jwt.expiresIn
    })
}

export const verify = (token) => {
    try {
        jwt.verify(token, env.jwt.secret)
        return true;
    }catch (e) {
        return false;
    }
}

export const decode = (token) => {
    return jwt.decode(token, env.jwt.secret)
}

export const getToken = (headerValue) => {
    const [type, token] = headerValue.split(' ')
    return type === 'Bearer' ? token : null
}