import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询资产验收建账列表
 */
export function getHandoverList(opts) {
    return axios.post(`${BASE_URL}/assets/assets-handover/v1/list`, opts)
}


/**
 * 资产移交新增或修改
 */
export function createOrUpdateHandover(opts) {
    return axios.post(`${BASE_URL}/assets/assets-handover/v1/createOrUpdate`, opts)
}

/**
 * 资产移交详情
 */
export function getHandoverDetail(id) {
    return axios.get(`${BASE_URL}/assets/assets-handover/v1/get`, { params: { id } })
}

/**
 * 资产移交确认
 */
export function updateHandover(id) {
    return axios.post(`${BASE_URL}/assets/assets-handover/v1/confirm?id=${id}`)
}

