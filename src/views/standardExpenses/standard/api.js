import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询标准经费列表
 */
export function getStandard(
  department,
  fiscal_year,
  max_give_outlay,
  min_give_outlay,
  max_pay_outlay,
  min_pay_outlay,
  max_rate,
  min_rate,
  pageNum,
  pageSize
) {
  return axios.get(`${BASE_URL}/fund/fund-outlay/v1/list?` +
  `department=${department}&` +
  `fiscal_year=${fiscal_year}&` +
  `max_give_outlay=${max_give_outlay}&` +
  `min_give_outlay=${min_give_outlay}&` +
  `max_pay_outlay=${max_pay_outlay}&` +
  `min_pay_outlay=${min_pay_outlay}&` +
  `max_rate=${max_rate}&` +
  `min_rate=${min_rate}&` +
  `pageNum=${pageNum}&` +
  `pageSize=${pageSize}`
  )
}

/**
 * 获取导出表格文件下载地址
 */
export function getExcel(ids) {
  return `${BASE_URL}/fund/fund-outlay/v1/export?ids=${ids}`
  // return axios.get(`${BASE_URL}/fund/fund-outlay/v1/export?ids=${ids}`)
}

/**
 * 获取导出表格模板文件下载地址
 */
export function getExcelMod() {
   return `${BASE_URL}/fund/fund-outlay/v1/upload`
}

/**
 * 新增一项标准经费
 */
export function addStandard(PostData) {
  return axios.post(`${BASE_URL}/fund/fund-outlay/v1/add`, PostData)
}

/**
 * 导入标准经费
 */
export function addExcel(PostData) {
  return axios.post(`${BASE_URL}/fund/fund-outlay/v1/import`, PostData)
}

/**
 * 导入标准经费
 */
export function deleteStandard(ids) {
  return axios.get(`${BASE_URL}/fund/fund-outlay/v1/delete?ids=${ids}`)
}
