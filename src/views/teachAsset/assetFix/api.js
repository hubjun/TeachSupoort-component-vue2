import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'


/**
 * 查询维修保养列表 (待调)
 */
export function getFixList(opts) {
  const url = BASE_URL + '/assets-maintenance-record/v1/maintenancerecord/list'
  return axios.post(url ,opts)
}

/**
 * 根据id查询维修保养详情 (待调)
 */
export function getFixDetail(id) {
  const url = BASE_URL + `/assets-maintenance-record/v1/detail/get`
  return axios.get(url, { params: { id } })
}

/**
 * 新增维修保养详情 (待调)
 */
export function createFix(opts) {
  const url = BASE_URL + '/assets-maintenance-record/v1/add'
  return axios.post(url, opts)
}

/**
 * 修改维修保养详情 (待调)
 */
export function updateFix(opts) {
  const url = BASE_URL + '/assets-maintenance-record/v1/update'
  return axios.post(url, opts)
}
