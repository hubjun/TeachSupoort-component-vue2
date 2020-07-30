import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'

/**
 * 通用查询字典列表
 */
export function getDictionary(opts) {
    return axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/list`, opts)
}

/**
 * 根据ID查询单个字典
 */
export function getDictionaryId(id) {
    return axios.get(`${BASE_URL}/book/book-basic-dictionary/v1/get?id=${id}`)
}

/**
 * 新增字典
 */
export function addDictionary(opts) {
    return axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/create`, opts)
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
export function disableDictionary(opts) {
    const url = BASE_URL + '/book/book-basic-dictionary/v1/disable'
    return axios.post(url + '?' + qs.stringify(opts))
}

/**
 * 课程列表
 * */
export function getCourseList(opts) {
    const url = BASE_URL + '/book/book-course/v1/list'
    return axios.post(url, opts)
}
/**
 * 课程、禁用/启用字典
 */
export function disableCourseDict(opts) {
    const url = BASE_URL + '/book/book-course/v1/disable'
    return axios.post(url + '?' + qs.stringify(opts))
}
/**
 * 课程详情
 */
export function getCourseDetail(opts) {
  const url = BASE_URL + '/book/book-course/v1/get'
  return axios.post(url + '?' + qs.stringify(opts))
}
/**
 * 新增课程
 */
export function addCourse(opts) {
  return axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/create`, opts)
}
