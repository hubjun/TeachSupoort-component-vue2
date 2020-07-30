import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 资产台账管理(管理部门)列表
 */
export function getAssetsRecord(opts) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/list`, { params: opts })
}

/**
 * 资产台账管理(管理部门)列表
 */
export function getAssetsRecordDert(opts) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/depa-name/list`, { params: opts })
}

/**
 * 新增台账
 */
export function addAssetsRecord(opts) {
    return axios.post(`${BASE_URL}/assets/assets-record/v1/add`,  opts)
}


/**
 * 资产台账详细信息-编辑保存（所有字段都需要有值）
 */
export function updateAssetsRecord(opts) {
    return axios.post(`${BASE_URL}/assets/assets-record/v1/update`,  opts)
}


/**
 * 维修保养
 */
export function wxbyList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/wxby/list/${id}`)
}

/**
 * 资产处理
 */
export function zcclbfList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/zccl-bf/list/${id}`)
}

/**
 * 资产处理
 */
export function zcclycList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/zccl-yc/list/${id}`)
}

/**
 * 资产调拨
 */
export function zcdbList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/zcdb/list/${id}`)
}

/**
 * 资产领用
 */
export function zclyList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/zcly/list/${id}`)
}

/**
 * 资产移交
 */
export function zcyjList(id) {
    return axios.get(`${BASE_URL}/assets/assets-record/v1/zcyj/list/${id}`)
}

/**
 * 树形结构组织信息查询
 */
export function getDeptTree(opts) {
    return axios.post(`${BASE_URL}/sys/dept/treeList`)
}


