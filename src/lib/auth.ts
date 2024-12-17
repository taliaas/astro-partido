
export function getAccessToken() {
    return localStorage.getItem('access_token')
}
export function removeToken() {
    return localStorage.removeItem('access_token')
}