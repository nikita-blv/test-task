const STORAGE_PREFIX = 'bitmedialabs-test:'

const getKey = (key) => `${STORAGE_PREFIX}${key}`

export const getItem = (key) => window.localStorage.getItem(getKey(key))
export const setItem = (key, value) => window.localStorage.setItem(getKey(key), value)
export const removeItem = (key) => window.localStorage.removeItem(getKey(key))
