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

export default { getList, empty }
