import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'

/**
 * 单独申报列表查询
 */
export function bookGrantDeclareList(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-declare/v1/list`, opts)
}

/**
 * 新增教材申报单详情
 */
export function addBookGrantDeclare(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-declare/v1/add`, opts)
}


/**
 * 教材申报单详情
 */
export function getBookGrantDeclare(id) {
    return axios.get(`${BASE_URL}/book/book-grant-declare/v1/get`, { params: { id } })
}

/**
 * 删除申报单
 */
export function deleteBookGrantDeclare(id) {
    return axios.get(`${BASE_URL}/book/book-grant-declare/v1/delete`, { params: { id } })
}

/**
 * 修改申报单
 */
export function updateBookGrantDeclare(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-declare/v1/update`, opts)
}

/**
 * 审批申报单
 */
export function auditBookGrantDeclare(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-declare/v1/audit?audit=${opts.audit}&id=${opts.id}&step=${opts.step}`)
}


/**
 * 教材集中发放清单查询
 */
export function bookGrantFocusList(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-focus/v1/list`, opts)
}

/**
 * 新增教材集中发放记录
 */
export function addBookGrantFocus(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-focus-record/v1/add`, opts)
}

/**
 * 生成发放清单
 */
export function createlist(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-focus/v1/createlist`, opts)
}

/**
 * 教材集中发放记录详情列表
 */
export function getdBookGrantFocus(id) {
    return axios.get(`${BASE_URL}/book/book-grant-focus-record/v1/list`, { params: { id } })
}


/**
 * 发放列表查询
 */
export function bookGrantRecordList(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-record/v1/list`, opts)
}

/**
 * 新增教材发放单详情
 */
export function addBookGrantRecord(opts) {
    return axios.post(`${BASE_URL}/book/book-grant-record/v1/add`, opts)
}

/**
 * 教材发放详情
 */
export function getBookGrantRecord(id) {
    return axios.get(`${BASE_URL}/book/book-grant-record/v1/get`, { params: { id } })
}


/**
 * 发放列表查询
 */
export function getByCode(grantDeclareCode) {
    return axios.get(`${BASE_URL}/book/book-grant-declare/v1/getByCode`, { params: { grantDeclareCode } })
}


