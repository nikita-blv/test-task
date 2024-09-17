import { urls } from "./urls.js";

export class Auth {
    constructor(client) {
        this.client = client;
    }

    signIn = async ({ username, password }) => {
        return (await this.client.post(urls.signIn, { username, password }))
            .data;
    };

    signUp = async ({ username, password }) => {
        return (await this.client.post(urls.signUp, { username, password }))
            .data;
    };

    refresh = async ({ refreshToken }) => {
        return (await this.client.post(urls.refresh, { refreshToken })).data;
    };

    currentUser = async () => {
        return (await this.client.get(urls.currentUser)).data;
    };
}