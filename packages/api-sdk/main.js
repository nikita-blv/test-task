import axios from "axios"
import { Auth } from "./src/auth.js";
import { LootBox } from "./src/lootBox.js";

export const createSdk = (baseURL, getAccessToken, getRefreshToken, setTokens) => {
    const axiosClient = axios.create({
        baseURL
    });
    axiosClient.interceptors.request.use(
        (config) => {
            config.headers['x-access-token'] = `Bearer ${getAccessToken()}`;
            return config;
        }
    )

    const auth = new Auth(axiosClient)
    const lootBox = new LootBox(axiosClient)

    return {
        auth,
        lootBox,
    }
}