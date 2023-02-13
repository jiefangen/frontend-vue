import Cookies from 'js-cookie'

const TokenKey = 'bamboo_token'

const NameKey = 'bamboo_name'

const UserIdKey = 'bamboo_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getName() {
  return Cookies.get(NameKey)
}

export function setName(name) {
  return Cookies.set(NameKey, name)
}

export function removeName() {
  return Cookies.remove(NameKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function setUserId(UserId) {
  return Cookies.set(UserIdKey, UserId)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}
