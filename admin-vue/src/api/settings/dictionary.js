import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/settings/dictionary/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/settings/dictionary/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/settings/dictionary/del/${id}`,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/settings/dictionary/edit',
    method: 'put',
    data
  })
}

// 获取所有字典选择
export function getAllDictOption() {
  return request({
    url: '/settings/dictionary/getAllDict',
    method: 'get'
  })
}

export default { getList, add, del, edit, getAllDictOption }
