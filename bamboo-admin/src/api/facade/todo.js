import request from '@/utils/request'

export function getTodoList(userId) {
  return request({
    url: `/facade/todo/list/${userId}`,
    method: 'post'
  })
}

export function sortTodo(data) {
  return request({
    url: `/facade/todo/sort`,
    method: 'post',
    data: data
  })
}

export function addTodoList(data) {
  return request({
    url: `/facade/todo/add`,
    method: 'post',
    data: data
  })
}

export function delTodo(data) {
  return request({
    url: `/facade/todo/del`,
    method: 'delete',
    data: data
  })
}

export function editTodo(data) {
  return request({
    url: `/facade/todo/edit`,
    method: 'put',
    data: data
  })
}
