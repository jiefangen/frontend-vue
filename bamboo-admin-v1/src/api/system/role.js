import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/system/menu/getRoutes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/system/role/getRoles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/system/role/add',
    method: 'post',
    data
  })
}

export function updateRole(roleId, data) {
  return request({
    url: `/system/role/updateRoleMenu/${roleId}`,
    method: 'put',
    data
  })
}

export function deleteRole(roleId) {
  return request({
    url: `/system/role/del/${roleId}`,
    method: 'delete'
  })
}

export default { getRoutes, getRoles, addRole, updateRole, deleteRole }
