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

export function getAccountDetails(data) {
  return request({
    url: '/services/account/details',
    method: 'post',
    data
  })
}

export function getServiceList(data) {
  return request({
    url: '/services/service/page',
    method: 'post',
    data
  })
}

export function getPermissionInfo(data) {
  return request({
    url: '/services/service/permission/info',
    method: 'post',
    data
  })
}

export default { getAccountList, addAccount, updateAccount, getAccountDetails, getServiceList, getPermissionInfo }
