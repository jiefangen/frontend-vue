import request from '@/utils/request'

export function getDictData(dictKey, appRange, onlyValue) {
  return request({
    url: '/common/settings/getDictData',
    method: 'get',
    params: { dictKey, appRange, onlyValue }
  })
}

export function rolePerRefresh() {
  return request({
    url: '/common/rolePer/refresh',
    method: 'get'
  })
}

export default { getDictData, rolePerRefresh }
