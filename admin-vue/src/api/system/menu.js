import request from '@/utils/request'

export function getMenus() {
  return request({
    url: '/system/menu/getMenus',
    method: 'get'
  })
}

export function getChildKeys(menuId) {
  return request({
    url: '/system/menu/getChildKeys',
    method: 'get',
    params: { menuId }
  })
}

export function addMenu(data) {
  return request({
    url: '/system/menu/add',
    method: 'post',
    data
  })
}

export function deleteMenu(menuId) {
  return request({
    url: `/system/menu/del/${menuId}`,
    method: 'delete'
  })
}

export function updateMenu(data) {
  return request({
    url: `/system/menu/update`,
    method: 'put',
    data
  })
}

export default { getMenus, getChildKeys, addMenu, deleteMenu, updateMenu }
