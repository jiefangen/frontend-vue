import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/settings/dictionary/data/page',
    method: 'post',
    data
  })
}

export function add(data) {
  return request({
    url: '/settings/dictionary/data/add',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/settings/dictionary/data/del/${id}`,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/settings/dictionary/data/edit',
    method: 'put',
    data
  })
}

export default { getList, add, del, edit }
