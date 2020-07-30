import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'


/**
 * 查询调拨申请单列表 (已通)
 */
export function getApplyList(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/list'
  return axios.post(url, opts)
}

/**
 * 查询调拨申请单详情 (已通)
 */
export function getApplyDetail(id) {
  const url = BASE_URL + '/assets/assets-allocate/v1/get'
  return axios.get(url + '?id=' + id)
}

/**
 * 新增或修改详情
 */
export function createOrUpdateApply(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/createOrUpdate'
  return axios.post(url, opts)
}

/**
 * 申报
 */
export function toApply(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/apply'
  return axios.post(url + '?' + qs.stringify(opts))
}

/**
 * 审核
 */
export function toConfirm(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/confirm'
  return axios.post(url + '?' + qs.stringify(opts))
}

/**
 * 审批
 */
export function toPass(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/pass'
  return axios.post(url + '?' + qs.stringify(opts))
}

/**
 * 驳回
 */
export function toReject(opts) {
  const url = BASE_URL + '/assets/assets-allocate/v1/reject'
  return axios.post(url + '?' + qs.stringify(opts))
}
