import Cookies from 'js-cookie'
import { encryptAES, decryptAES } from '@/utils/encryptor'

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
    const rawtext = decryptAES(rememberInfo)
    return JSON.parse(rawtext)
  }
}

export function setRememberInfo(rememberInfo) {
  const ciphertext = encryptAES(JSON.stringify(rememberInfo))
  return Cookies.set(RememberInfo, ciphertext, { expires: 7 })
}

export function removeRememberInfo() {
  return Cookies.remove(RememberInfo)
}
