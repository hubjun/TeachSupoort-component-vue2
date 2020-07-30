import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 教材采购计划列表
 */
export function purchasePlanList(opts) {
    return axios.post(`${BASE_URL}/book/book-purchase-plan/v1/list`, opts)
}

/**
 * 教材采购需求列表
 */
export function purchasePlanReqList(opts) {
    return axios.post(`${BASE_URL}/book/book-purchase-plan/v1/req/list`, opts)
}

