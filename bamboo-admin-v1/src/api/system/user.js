import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/system/user/add',
    method: 'post',
    data
  })
}

export function del(username) {
  return request({
    url: `/system/user/del/${username}`,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/system/user/edit',
    method: 'put',
    data
  })
}

export function updatePass(data) {
  return request({
    url: '/system/user/updatePassword',
    method: 'post',
    data
  })
}

export function resetPassword(data) {
  return request({
    url: '/system/user/resetPassword',
    method: 'post',
    data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/system/user/updateUserRole',
    method: 'post',
    data
  })
}

export function getList(data) {
  return request({
    url: '/system/user/page',
    method: 'post',
    data
  })
}

export default { add, edit, updatePass, resetPassword, del, getList }
