import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询需求计划列表
 */
export function getDemandPlan(opts) {
  return axios.post(`${BASE_URL}/assets/planning/page`, opts)
}

/**
 * 根据id查询单个需求计划
 */
export function getDemandPlanId(id) {
  return axios.get(`${BASE_URL}/assets/planning/get/${id}`)
}

/**
 * 新增需求计划
 */
export function addDemandPlan(opts) {
  return axios.post(`${BASE_URL}/assets/planning/add`, opts)
}

/**
 * 修改需求计划
 */
export function editDemandPlan(opts) {
  return axios.post(`${BASE_URL}/assets/planning/update`, opts)
}

/**
 * 删除需求计划的某行
 */
export function deleteDemandPlanLine(id) {
  return axios.get(`${BASE_URL}/assets/planning/delete-line?ids=${id}`)
}

/**
 * 改变需求计划审核状态
 */
export function commitPlanning(opts) {
  return axios.post(`${BASE_URL}/assets/planning/commit`, opts)
}

