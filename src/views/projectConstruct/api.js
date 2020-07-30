import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'
import qs from 'qs'

/**
 * 项目建设列表
 */
export function getConstructList(opts) {
    const url = BASE_URL + '/project/project-progress/list'
    return axios.post(url, opts)
}

/** 
 * 新增项目
*/
export function createConstructInfo(opts) {
    const url = BASE_URL + '/project/project-progress/createOrUpdate'
    return axios.post(url, opts)
}

/**
 * 项目建设详情
 */
export function getConstructInfo(opts) {
    const url = BASE_URL + '/project/project-progress/get'
    return axios.get(url + '?id=' + opts)
}

/**
 * 编辑-项目建设进展记录列表
 */
export function editConstructRecord(opts) {
    const url = BASE_URL + '/project/project-progress-record/list'
    return axios.get(url + '?projectId=' + opts)
}

/**
 * 编辑-项目进展记录列表
 */
export function getProjectList(opts) {
    const url = BASE_URL + '/project/project-progress-sheet/getList'
    return axios.get(url + '?progressId=' + opts)
}