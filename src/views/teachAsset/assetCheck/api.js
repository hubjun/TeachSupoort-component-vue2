import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'


/**
 * 查询盘点单列表
 */
export function getCheckPlanList(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/assetscheck/list'
  return axios.post(url, opts)
}

/**
 * 新增盘点单详情
 */
export function createCheckPlan(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/add'
  return axios.post(url, opts)
}

/**
 * 资产清查计划查询
 */
export function getCheckPlanCreate(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/assetsplan/list'
  return axios.post(url ,opts)
}

/**
 * 生成盘点计划
 */
export function exportCheckPlanCreate(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/assetsplan/create'
  return axios.post(url ,opts)
}

/**
 * 清查详情
 */
export function getCheckPlanListDetails(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/get'
  return axios.get(url + '?id=' + opts)
}

/**
 * 确认盘点单
 */
export function confirmPlanListInfo(opts) {
  const url = BASE_URL + '/assets/assets-check/v1/notarize'
  return axios.get(url + '?id=' + opts)
}