import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/monitor/log/page',
    method: 'post',
    data
  })
}

export function empty() {
  return request({
    url: '/monitor/log/empty',
    method: 'delete'
  })
}

export function getOnlineUser(data) {
  return request({
    url: '/monitor/log/online',
    method: 'post',
    data
  })
}

export function onlineQuit(tokenId) {
  return request({
    url: `/monitor/log/onlineQuit/${tokenId}`,
    method: 'put'
  })
}

export default { getList, empty, getOnlineUser, onlineQuit }
