import axios from '@/axios/index'
import { BASE_URL } from '@/axios/Global'



/**
 * 查询供应商列表
 */
export function getSupplier(pageNum, pageSize, searchCode, status) {
  return axios.get(`${BASE_URL}/assets/supplier/v1/select?pageNum=${pageNum}&pageSize=${pageSize}&searchCode=${searchCode}&status=${status}`)
}

/**
 * 修改供应商
 */
export function updateSupplier(PostData) {
  return axios.post(`${BASE_URL}/assets/supplier/v1/update`, PostData)
}

/**
 * 新增供应商
 */
export function addSupplier(PostData) {
  return axios.post(`${BASE_URL}/assets/supplier/v1/add`, PostData)
}

/**
 * 启用停用供应商
 */
export function disableSupplier(action, ids) {
  return axios.get(`${BASE_URL}/assets/supplier/v1/batch/update?action=${action}&ids=${ids}`)
}

/**
 * 查询采购合同列表
 */
export function getContract(
  contract_bill_code,
  contract_name,
  endTime,
  maxPrice,
  minPrice,
  pageNum,
  pageSize,
  startTime,
  supplier_id
) {
  return axios.get(
    `${BASE_URL}/assets/contract/v1/list?contract_bill_code=${contract_bill_code}&` +
    `contract_name=${contract_name}&` +
    `endTime=${endTime}&` +
    `maxPrice=${maxPrice}&` +
    `minPrice=${minPrice}&` +
    `pageNum=${pageNum}&` +
    `pageSize=${pageSize}&` +
    `startTime=${startTime}&` +
    `supplier_id=${supplier_id}&`
  )
}



/**
 * 查询单个采购合同
 */
export function PurchaseContractId(id) {
  return axios.get(`${BASE_URL}/assets/contract/v1/detail/get/${id}`)
}

/**
 * 查询单个采购合同
 */
export function searchCode(searchCode) {
  return axios.get(`${BASE_URL}/assets/contract/v1/cgjh/list?searchCode=${searchCode}`)
}

/**
 * 修改采购合同
 */
export function updatePurchaseContract(PostDate) {
  return axios.post(`${BASE_URL}/assets/contract/v1/update`, PostDate)
}

/**
 * 新增采购合同
 */
export function addPurchaseContract(PostDate) {
  return axios.post(`${BASE_URL}/assets/contract/v1/add`, PostDate)
}
