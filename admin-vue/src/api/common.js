import request from '@/utils/request'

export function getDictData(dictKey, appRange, onlyValue) {
  return request({
    url: '/common/settings/getDictData',
    method: 'get',
    params: { dictKey, appRange, onlyValue }
  })
}

export default { getDictData }
