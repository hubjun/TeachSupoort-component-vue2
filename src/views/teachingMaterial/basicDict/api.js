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
export function editDictionary(opts) {
    return axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/update`, opts)
}

/**
 * 禁用/启用字典
 */
export function disableDictionary(opts) {
    return axios.post(`${BASE_URL}/book/book-basic-dictionary/v1/disable?disable=${opts.disable}&ids=${opts.ids}`)
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
    return axios.post(`${BASE_URL}/book/book-course/v1/disable?disable=${opts.disable}&ids=${opts.ids}`)
}
/**
 * 课程详情
 */
export function getCourseDetail(id) {
    return axios.get(`${BASE_URL}/book/book-course/v1/get`, { params: { id } })
}
/**
 * 新增课程
 */
export function addCourse(opts) {
    return axios.post(`${BASE_URL}/book/book-course/v1/createOrUpdate`, opts)
}
