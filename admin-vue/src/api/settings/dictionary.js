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

export default { getList, add, del, edit }
