import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'

/**
 * 教材入库列表查询
 */
export function bookStorageList(opts) {
    return axios.post(`${BASE_URL}/book/book-storage/v1/list`, opts)
}

/**
 * 新增入库单详情
 */
export function addBookStorage(opts) {
    return axios.post(`${BASE_URL}/book/book-storage/v1/add`, opts)
}

/**
 * 新增入库单详情
 */
export function updateBookStorage(opts) {
    return axios.post(`${BASE_URL}/book/book-storage/v1/update`, opts)
}

/**
 * 查询入库单详情
 */
export function getStorage(id) {
    return axios.get(`${BASE_URL}/book/book-storage/v1/get?id=${id}`)
}

/**
 * 删除入库单
 */
export function delStorage(id) {
    return axios.get(`${BASE_URL}/book/book-storage/v1/delete?id=${id}`)
}

/**
 * 删除入库单详情
 */
export function delDetailStorage(ids) {
    return axios.get(`${BASE_URL}/book/book-storage/v1/deleteDetail?ids=${ids}`)
}
