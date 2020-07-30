import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询资产验收建账列表
 */
export function getReceiptApply(opts) {
    return axios.post(`${BASE_URL}/assets/assets-req-apply/v1/list`, opts)
}


/**
 * 资产领用申请新增或者修改
 */
export function createOrUpdateApply(opts) {
    return axios.post(`${BASE_URL}/assets/assets-req-apply/v1/createOrUpdate`, opts)
}

/**
 * 资产领用申请/审核详情
 */
export function getApplyDetail(id) {
    return axios.get(`${BASE_URL}/assets/assets-req-apply/v1/get`, { params: { id } })
}

/**
 * 资产领用申请/审核详情
 */
export function applyAssets(id) {
    return axios.post(`${BASE_URL}/assets/assets-req-apply/v1/apply?id=${id}`)
}

/**
 * 资产领用申请审核
 */
export function passAssets(id, approvalInfo) {
    return axios.post(`${BASE_URL}/assets/assets-req-apply/v1/pass?id=${id}&approvalInfo=${approvalInfo}`)
}

/**
 * 资产领用申请审核
 */
export function rejectAssets(id, approvalInfo) {
    return axios.post(`${BASE_URL}/assets/assets-req-apply/v1/reject?id=${id}&approvalInfo=${approvalInfo}`)
}

