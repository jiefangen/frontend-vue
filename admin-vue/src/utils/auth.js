import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

const RememberInfo = 'Remember-Info'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRememberInfo() {
  const rememberInfo = Cookies.get(RememberInfo)
  if (rememberInfo !== undefined) {
    return JSON.parse(rememberInfo)
  }
}

export function setRememberInfo(rememberInfo) {
  return Cookies.set(RememberInfo, JSON.stringify(rememberInfo), { expires: 7 })
}

export function removeRememberInfo() {
  return Cookies.remove(RememberInfo)
}
