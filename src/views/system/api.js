import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 树形结构组织信息查询
 */
export function getDeptTree(opts) {
    return axios.post(`${BASE_URL}/sys/dept/treeList`)
}

/**
 * 新增部门
 */
export function addDepart(opts) {
    return axios.post(`${BASE_URL}/sys/dept/create`, opts)
}

/**
 * 删除部门
 */
export function deleteDepart(id) {
    return axios.post(`${BASE_URL}/sys/dept/delete?id=${id}`)
}

/**
 * 删除部门
 */
export function enabledDept(opts) {
    return axios.post(`${BASE_URL}/sys/dept/enabledDept?id=${opts.id}&enabled=${opts.enabled}`)
}

/**
 * 条件查询用户操作日志
 */
export function getLogList(opts) {
    return axios.get(`${BASE_URL}/sys-operate-log/pageList`, { params: opts })
}

/**
 * pageList
 */
export function getUserList(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/list`,  opts)
}

/**
 * addUser
 */
export function addUser(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/add`, opts)
}

/**
 * 修改用户
 */
export function updateUser(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/update`, opts)
}

/**
 * 重置为默认密码
 */
export function defaultPassword(id) {
    return axios.post(`${BASE_URL}/sys/access-user/password/default?id=${id}`)
}


/**
 * 用户添加部门
 */
export function relationDepart(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/relation/dept?deptId=${opts.deptId}&userId=${opts.userId}`)
}

/**
 * 用户添加角色
 */
export function relationRoles(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/relation/role?userId=${opts.userId}&userRoles=${opts.userRoles}`)
}


/**
 * 启用/停用用户
 */
export function updateEnabledUser(opts) {
    return axios.post(`${BASE_URL}/sys/access-user/updateEnabled?id=${opts.id}&enabled=${opts.enabled}`)
}

/**
 * 树形结构菜单
 */
export function menuTree() {
    return axios.get(`${BASE_URL}/sys/menu/tree`)
}


/**
 * 删除菜单
 */
export function delMenu(id) {
    return axios.post(`${BASE_URL}/sys/menu/delete/${id}`)
}

/**
 * 新增菜单
 */
export function createMenu(opts) {
    return axios.post(`${BASE_URL}/sys/menu/create`, opts)
}

/**
 * 修改菜单
 */
export function updateMenu(opts) {
    return axios.post(`${BASE_URL}/sys/menu/update`, opts)
}

/**
 * 修改菜单
 */
export function menuList(opts) {
    return axios.post(`${BASE_URL}/sys/menu/list`, opts)
}

/**
 * 根据条件查询所有角色列表
 */
export function rolePage(opts) {
    return axios.get(`${BASE_URL}/sys/role/page`, { params: opts })
}

/**
 * 新增角色
 */
export function createRole(opts) {
    return axios.post(`${BASE_URL}/sys/role/create?roleDesc=${opts.roleDesc}&roleName=${opts.roleName}`)
}

/**
 * 修改角色
 */
export function updateRole(opts) {
    return axios.post(`${BASE_URL}/sys/role/update?roleDesc=${opts.roleDesc}&roleName=${opts.roleName}&id=${opts.id}`)
}

/**
 * 删除角色
 */
export function deleteRole(id) {
    return axios.post(`${BASE_URL}/sys/role/delete?id=${id}`)
}


/**
 * 批量删除角色
 */
export function batchDeleteRole(ids) {
    return axios.post(`${BASE_URL}/sys/role/delete/batch?ids=${ids}`)
}

/**
 * 批量删除角色
 */
export function relationRole(opts) {
    return axios.post(`${BASE_URL}/sys/role/relation?menuIds=${opts.menuIds}&roleId=${opts.roleId}`)
}

/**
 * 查询角色明细
 */
export function getRole(id) {
    return axios.get(`${BASE_URL}/sys/role/get/${id}`)
}
