import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/permission/page',
    method: 'post',
    data
  })
}

export function getPermission(roleId) {
  return request({
    url: `/system/permission/getPermission`,
    method: 'get',
    params: { roleId }
  })
}

export default { getList, getPermission }
