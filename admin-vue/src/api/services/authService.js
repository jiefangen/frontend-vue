import request from '@/utils/request'

export function getAccountList(data) {
  return request({
    url: '/services/account/page',
    method: 'post',
    data
  })
}

export function addAccount(data) {
  return request({
    url: '/services/account/add',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  return request({
    url: '/services/account/update',
    method: 'put',
    data
  })
}

export default { getAccountList, addAccount, updateAccount }
