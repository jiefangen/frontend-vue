import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/settings/parameter/page',
    method: 'post',
    data
  })
}

export default { getList }
