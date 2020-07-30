import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'


/**
 * 查询教材库存列表
 */
export function getInventoryInquireList(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory/v1/list`, opts)
}

/**
 * 返回表格地址
 */
export function getExcel(ids) {
  return `${BASE_URL}/book/book-repertory/v1/export?ids=${ids}`
}

/**
 * 查询教材盘点单列表
 */
export function getInventoryList(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory-inventory/v1/list`, opts)
}

/**
 * 查询教材盘点单列表
 */
export function getInventoryId(id) {
  return axios.get(`${BASE_URL}/book/book-repertory-inventory/v1/get?id=${id}`)
}

/**
 * 新增盘点单详情
 */
export function addInventory(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory-inventory/v1/add`, opts)
}

/**
 * 修改盘点单
 */
export function updateInventory(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory-inventory/v1/update`, opts)
}

/**
 * 确认盘点单
 */
export function qrInventory(id) {
  return axios.get(`${BASE_URL}/book/book-repertory-inventory/v1/notify?id=${id}`)
}

/**
 * 删除盘点单明细
 */
export function deleteInventorymx(ids) {
  return axios.get(`${BASE_URL}/book/book-repertory-inventory/v1/deleteDetail?ids=${ids}`)
}

/**
 * 删除盘点单
 */
export function deleteInventory(ids) {
  return axios.get(`${BASE_URL}/book/book-repertory-inventory/v1/delete?id=${ids}`)
}

/**
 * 删除盘点单
 */
export function getAdjustment(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory-adjustment/v1/list`, opts)
}

/**
 * 生成调整单
 */
export function Adjustment(id) {
  return axios.get(`${BASE_URL}/book/book-repertory-inventory/v1/addAdjustment?id=${id}`)
}

/**
 * 查询调整单详情
 */
export function getAdjustmentId(id) {
  return axios.get(`${BASE_URL}/book/book-repertory-adjustment/v1/get?id=${id}`)
}

/**
 * 修改调整单详情
 */
export function updateAdjustment(opts) {
  return axios.post(`${BASE_URL}/book/book-repertory-adjustment/v1/update`, opts)
}

/**
 * 审核调整单
 */
export function auditAdjustment(id) {
  return axios.post(`${BASE_URL}/book/book-repertory-adjustment/v1/audit?id=${id}`)
}
