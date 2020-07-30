import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'


/**
 * 查询折旧方法列表
 */
export function getDepreciationWayList(opts) {
  const url = BASE_URL + '/assets-depreciation-method/v1/list'
  return axios.post(url + '?' + qs.stringify(opts))
}

/**
 * 根据id查询折旧方法详情
 */
export function getDepreciationWayDetail(id) {
  const url = BASE_URL + `/assets-depreciation-method/v1/detail/get/${id}`
  return axios.get(url)
}

/**
 * 新增折旧方法详情
 */
export function createDepreciationWay(opts) {
  const url = BASE_URL + '/assets-depreciation-method/v1/add'
  return axios.post(url, opts)
}

/**
 * 修改折旧方法详情
 */
export function updateDepreciationWay(opts) {
  const url = BASE_URL + '/assets-depreciation-method/v1/update'
  return axios.post(url, opts)
}

/**
 *  批量修改折旧方法状态
 */
export function batchUpdateDepreciationWay(opts) {
  const url = BASE_URL + '/assets-depreciation-method/v1/batchUpdate'
  return axios.post(url, opts)
}

/**
 *  查询计提折旧列表 (待调)
 */
export function getProvisionDepreciationList(opts) {
  const url = BASE_URL + '/assets-depreciation-record/v1/list'
  return axios.post(url + '?' + qs.stringify(opts))
}

/**
 *  确认计提折旧 (待调)
 */
export function confirmProvisionDepreciationList(opts) {
  const url = BASE_URL + '/assets-depreciation-record/v1/updateAssetRecord'
  return axios.post(url + '?' + qs.stringify(opts))
}
