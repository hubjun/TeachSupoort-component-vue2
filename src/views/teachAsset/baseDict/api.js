import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询字典列表
 */
export function getDictionary(opts) {
  return axios.post(`${BASE_URL}/basic-dictionary/page`, opts)
}

/**
 * 根据ID查询单个字典
 */
export function getDictionaryId(id) {
  return axios.get(`${BASE_URL}/basic-dictionary/get?id=${id}`)
}

/**
 * 新增字典
 */
export function addDictionary(opts) {
  return axios.post(`${BASE_URL}/basic-dictionary/add`, opts)
}

/**
 * 修改字典
 */
export function editDictionary(id, name) {
  return axios.post(`${BASE_URL}/basic-dictionary/update?id=${id}&name=${name}`)
}

/**
 * 禁用/启用字典
 */
export function disableDictionary(disable, id) {
  return axios.post(`${BASE_URL}/basic-dictionary/disable?disable=${disable}&ids=${id}`)
}
