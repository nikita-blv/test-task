import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        password: {
            salt: {
                type: String,
                required: true,
            },
            hash: {
                type: String,
                required: true,
            },
        },
    },
    { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

export const userDao = {
    createUser: (username, hash, salt) => {
        return User.create({
            username,
            password: {
                hash,
                salt
            }
        })
    },
    findByUsername: async (username) => (await User.find({ username }))[0],
    findById: async (id, session = null) => (await User.findById(id).session(session).exec())
}
