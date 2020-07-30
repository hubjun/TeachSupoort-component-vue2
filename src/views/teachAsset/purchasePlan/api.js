import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询集中处理需求计划列表
 */
export function getCentralizedProcessing(opts) {
  return axios.post(`${BASE_URL}/assets/purchase-plan/page/list/planing`, opts)
}

/**
 * 生成采购计划
 */
export function generateCentralizedProcessing(PostData) {
  return axios.post(`${BASE_URL}/assets/purchase-plan/create`, PostData)
}

/**
 * 保存采购计划
 */
export function saveCentralizedProcessing(PostData) {
  return axios.post(`${BASE_URL}/assets/purchase-plan/update`, PostData)
}

/**
 * 修改采购计划状态
 */
export function commitCentralizedProcessing(PostData) {
  return axios.post(`${BASE_URL}/assets/purchase-plan/commit`, PostData)
}


/**
 * 查询需求计划列表
 */
export function getCentralizedProcessingList(opts) {
  return axios.post(`${BASE_URL}/assets/purchase-plan/page`, opts)
}

/**
 * 查询采购计划
 */
export function getCentralizedProcessingId(id) {
  return axios.get(`${BASE_URL}/assets/purchase-plan/get/${id}`)
}

