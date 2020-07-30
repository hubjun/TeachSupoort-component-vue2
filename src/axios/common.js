/* eslint-disable no-useless-escape */
import axios from 'axios';
import Vue from 'vue'
import { BASE_URL, urlName1 } from '@/axios/Global'
/**
 * 上传文件
 */
export const uploadUrl = `${BASE_URL}/common/file/uploadImg`;
export const uploadCert = `${BASE_URL}/common/file/uploadFile`;

// 两端去空格函数
// String.prototype.trimAll = function(){return this.replace(/\s+/g,'');}
// String.prototype.trim = function(){return this.replace(/(^\s*)|(\s*$)/g,''); }


export function infoMsg(message) {
  Vue.prototype.$message({
    type: 'info',
    message: message
  });
}
export function successMsg(message) {
  Vue.prototype.$message({
    type: 'success',
    message: `${message}成功`
  });
}
export function error(message) {
  let msg = message || '服务器异常！请稍后再试'
  Vue.prototype.$message({
    type: 'error',
    message: msg
  });
}
export function errorMsg(err, message) {
  const msg = (err.msg || err.message) ? (err.msg ? err.msg : err.message) : `${message}`;
  Vue.prototype.$message({
    type: 'error',
    message: msg
  });
}

/**
 * 获取文字拼音码
 * @param {String} name 名称
 */
export function getPinyin(name) {
  return new Promise((resolve, reject) => {
    axios.get(`${urlName1}/common/pinyin`, {
      params: {
        name
      }
    }).then(response => {
      resolve(response);
    }, err => {
      reject(err)
    })
  })
}

/**
 * 获取文字拼音码
 * @param {String} name 名称
 */
export function getWubin(name) {
  return new Promise((resolve, reject) => {
    axios.get(`${urlName1}/common/wubi`, {
      params: {
        name
      }
    }).then(response => {
      resolve(response);
    }, err => {
      reject(err)
    })
  })
}

// 格式化时间
export function formatDate(time, flag) {
  var date = new Date(time);
  var fmt = !flag ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd';
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    );
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }

  return fmt;
}


/**
 * 查询所有物资
 * @param {String} materialName 物资名称
 * @param {Number} pageIndex 第几页
 * @param {Number} pageNum 每页多少条
 * @param {Number} materialType  1为散货 2 为定数包
 */

export function getMaterialPlan(materialName, materialType, pageNum, pageSize) {
  return new Promise((resolve, reject) => {
    axios.get(`${urlName1}/purchase-plan/v1/material/list`, {
      params: {
        materialName, materialType, pageNum, pageSize
      }
    }).then(response => {
      resolve(response);
    }, err => {
      reject(err)
    })
  })
}

/**
 * 获取所有的仓库
 */

export function warehousesList() {
  return new Promise((resolve, reject) => {
    axios.get(`${urlName1}/im-material-storage/v1/warehouses/list`).then(response => {
      resolve(response);
    }, err => {
      reject(err)
    })
  })
}


/**
 * 查询资产验收建账列表
 */
export function getAssetsRecordList(opts) {
  return axios.get(`${BASE_URL}/assets/assets-record/v1/list`, { params: opts })
}

/**
 * 入库教材采购弹窗
 */
export function planlist(opts) {
  return axios.post(`${BASE_URL}/book/book-storage/v1/planlist`,  opts)
}

// 只能输入正浮点数
export function limitFloat(target, name, flag) {
  target[name] = target[name]
    .replace(/[^\d.]/g, '')
    .replace(/\.{2,}/g, '.')
    .replace('.', '$#$')
    .replace(/\./g, '')
    .replace('$#$', '.')
    .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
    .replace(/^\./g, '');
  if (flag && target[name] !== '') {
    target[name] = (target[name] - 0).toFixed(2);
  }
  this.$set(target, name, target[name])
}

// 只能输入正整数
export function limitInt(target, name) {
  console.log(target[name]);
  target[name] = target[name].replace(/[^0-9]/g, '');
  this.$set(target, name, target[name])
}

/**
 * 删除附件ById
 */
export function deleteFile(id) {
  return axios.get(`${BASE_URL}/common/file/deleteFile`, { params: id })
}

// 获取五笔码和拼音码

export function getCode(form, name) {
  if (form[name]) {
    getPinyin(form[name])
      .then(res => {
        if (res.status) {
          form.pinyinCode = res.data;
        } else {
          this.$error(res.msg);
        }
      })
      .catch(err => {
        this.$errorMsg(err, '获取拼音码');
      });
    getWubin(form[name])
      .then(res => {
        if (res.status) {
          form.fiveStrokeCode = res.data;
        } else {
          this.$error(res.msg);
        }
      })
      .catch(err => {
        this.$errorMsg(err, '获取五笔码');
      });
  }
}

// 获取数据类型
export function getDataType(obj) {
  var typeArr = ['String', 'Object', 'Number', 'Array', 'Date'];
  for (let name of typeArr) {
    if (Object.prototype.toString.call(obj) === `[object ${name}]`) {
      return name;
    }
  }
}
