import { getItem, setItem } from "@root/shared/storage";

const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN_KEY'
const REFRESH_TOKEN_KEY = 'REFRESH_TOKEN_KEY'

export const getAccessToken = () => getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => getItem(REFRESH_TOKEN_KEY)

export const setSession = (accessToken, refreshToken) => {
    setItem(ACCESS_TOKEN_KEY, accessToken)
    setItem(REFRESH_TOKEN_KEY, refreshToken)
}
