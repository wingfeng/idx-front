import request from '@/utils/request'

export function Page(params) {
  return request({
    url: 'api/v1/system/clients/page',
    method: 'get',
    params
  })
}

export function Save(data) {
  return request({
    url: 'api/v1/system/clients',
    method: 'put',
    data
  })
}
