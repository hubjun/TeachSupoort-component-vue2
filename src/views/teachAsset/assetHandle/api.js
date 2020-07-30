import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'

/**
 * 查询报废申请列表
 */
export function getScrapList(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/jbc/list'
  return axios.get(url + '?' + qs.stringify(opts))
}

/**
 * 报废申请 保存
 */
export function createScrap(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/add'
  return axios.post(url, opts)
}

/**
 * 报废申请 申报
 */
export function applyScrap(id) {
  const url = BASE_URL + '/assets/assets-scrap/v1/save/' + id
  return axios.get(url)
}

/**
 * 报废申请 审核
 */
export function confirmScrap(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/sh/update'
  return axios.post(url, opts)
}

/**
 * 报废申请 驳回
 */
export function rejectScrap(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/bh/update'
  return axios.post(url, opts)
}

/**
 * 查询报废登记列表
 */
export function getScrapRegisterList(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/register/list'
  return axios.get(url + '?' + qs.stringify(opts))
}

/**
 * 报废登记 保存
 */
export function createScrapRegister(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/register/add'
  return axios.post(url, opts)
}

/**
 * 报废登记 确认
 */
export function confirmScrapRegister(id) {
  const url = BASE_URL + '/assets/assets-scrap/v1/register/update/' + id
  return axios.post(url)
}

/**
 * 查询异常处置列表
 */
export function getUnusualList(opts) {
  const url = BASE_URL + '/assets/assets-unusual/v1/list'
  return axios.get(url + '?' + qs.stringify(opts))
}

/**
 * 根据id查询异常处置详情
 */
export function getUnusualDetail(id) {
  const url = BASE_URL + '/assets/assets-unusual/v1/list'
  return axios.get(url, { params: { id } })
}

/**
 * 新增异常处置详情 (待调)
 */
export function createUnusual(opts) {
  const url = BASE_URL + '/assets/assets-unusual/v1/unusual/add'
  return axios.post(url, opts)
}

/**
 * 修改保存异常处置详情 (待调)
 */
export function updateUnusual(opts) {
  const url = BASE_URL + '/assets/assets-unusual/v1/unusual/update'
  return axios.post(url, opts)
}

/**
 * 查询（已审核）报废申请单编码
 */
export function getIsCheckScrapCode(opts) {
  const url = BASE_URL + '/assets/assets-scrap/v1/list'
  return axios.get(url + '?' + qs.stringify(opts))
}

/**
 * 异常处置-新增处置-确认
 */
export function confirmAddList(id) {
  const url = BASE_URL + '/v1/sure/update/'
  return axios.get(url + '?id=' + id)
}