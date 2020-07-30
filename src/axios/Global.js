import { baseUrl, baseIp, basePort, proxyName } from '@/util/env'
let BASE_URL = baseUrl;  // 开发服务器地址
// let BASE_URL = 'http://47.103.66.189:8899';  // 开发服务器地址
// let BASE_URL = 'http://192.168.3.127:8899';  // 危伟服务器地址

const urlName1 = 'spd-web';
const urlName2 = 'spd-oauth';
// console.log(baseUrl, 'baseUrl');
// console.log(baseIp, 'baseIp');
// console.log(basePort, 'basePort');
// console.log(proxyName, 'proxyName');

// var arg = process.argv.splice(2);
// if (arg && arg.length > 0) {
//   if (arg[0] === '130') {
//     BASE_URL = 'http://192.168.2.130:8091/';
//   } else if (arg[0] === '93') {
//     BASE_URL = 'http://192.168.2.93:8091/';
//   }
// }

export {
  BASE_URL,
  urlName1,
  urlName2
}
