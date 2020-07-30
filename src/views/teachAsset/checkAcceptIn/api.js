import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询资产验收建账列表
 */
export function getReceipt(opts) {
    return axios.get(`${BASE_URL}/assets/receipt/v1/list`, { params: opts })
}


/**
 * 查询供应商
 */
export function getSupplier(opts) {
    return axios.get(`${BASE_URL}/assets/supplier/v1/select`, { params: opts })
}

/**
 * 查询供应商
 */
export function getContractList(opts) {
    return axios.get(`${BASE_URL}/assets/receipt/v1/contract/list`, { params: opts })
}

/**
 * 验收单详情
 */
export function getReceiptDetail(id) {
    return axios.get(`${BASE_URL}/assets/receipt/v1/detail/get/${id}`)
}

/**
 * 根据合同ID查询可以建账的资产
 */
export function getAssetList(opts) {
    return axios.get(`${BASE_URL}/assets/receipt/v1/asset/list/`, { params: opts })
}

/**
 * 根据合同ID查询可以建账的资产
 */
export function addAsset(opts) {
    return axios.post(`${BASE_URL}/assets/receipt/v1/add`, opts)
}
