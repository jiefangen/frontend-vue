import request from '@/utils/request'

export function login(data) {
  // 用于支持文件上传和复杂的表单提交
  const formData = new FormData()
  formData.append('username', data.username)
  formData.append('password', data.password)
  // 用于发送简单的GET请求，将查询参数添加到URL的末尾
  const urlParams = new URLSearchParams()
  urlParams.append('username', data.username)
  urlParams.append('password', data.password)
  return request({
    url: '/login',
    method: 'post',
    data: urlParams
  })
}

export function getInfo() {
  return request({
    url: '/system/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
