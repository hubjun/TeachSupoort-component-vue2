import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'


/**
 * 查询保密级别列表
 */
export function getconfidentialityLevelList(req_name, secrecy_state, pageNum, pageSize) {
  return axios.post(`${BASE_URL}/secret/secrecy-dict/v1/list?req_name=${req_name}&secrecy_state=${secrecy_state}&pageNum=${pageNum}&pageSize=${pageSize}`)
}

/**
 * 保密级别停用
 */
export function stopuserConfidentialityLevelList(id) {
  return axios.get(`${BASE_URL}/secret/secrecy-dict/v1/stopuser?id=${id}`)
}

/**
 * 保密级别启用
 */
export function startuserConfidentialityLevelList(id) {
  return axios.get(`${BASE_URL}/secret/secrecy-dict/v1/startuser?id=${id}`)
}

/**
 * 保密级别修改
 */
export function updateConfidentialityLevelList(opts) {
  return axios.post(`${BASE_URL}/secret/secrecy-dict/v1/update`, opts)
}

/**
 * 保密级别新增
 */
export function addConfidentialityLevelList(opts) {
  return axios.post(`${BASE_URL}/secret/secrecy-dict/v1/add`, opts)
}

/**
 * 保密资料录入
 */
export function addConfidentiality(opts) {
  return axios.post(`${BASE_URL}/secret/secrecy-record/v1/add`, opts)
}

/**
 * 资料查询
 */
export function getConfidentialityList(data_code, data_name, data_type, pageNum, pageSize, secrecy_levelid) {
  return axios.post(`${BASE_URL}/secret/secrecy-record/v1/list?data_code=${data_code}&data_name=${data_name}&data_type=${data_type}&pageNum=${pageNum}&pageSize=${pageSize}&secrecy_levelid=${secrecy_levelid}`)
}


