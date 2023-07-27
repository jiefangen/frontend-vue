import request from '@/utils/request'

export function getOnlineUser(data) {
  return request({
    url: '/monitor/online/page',
    method: 'post',
    data
  })
}

export function onlineQuit(tokenId) {
  return request({
    url: `/monitor/online/quit/${tokenId}`,
    method: 'put'
  })
}

export default { getOnlineUser, onlineQuit }
