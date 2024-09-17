import { randomBytes, scryptSync } from 'crypto';

const encryptPassword = (password, salt) => {
    return scryptSync(password, salt, 32).toString('hex');
};

export const hashPassword = (password) => {
    const salt = randomBytes(16).toString('hex');
    return { hash: encryptPassword(password, salt), salt };
};

export const matchPassword = (password, hash, salt) => {
    return encryptPassword(password, salt) === hash
}
