import { RequestServerClass } from '@/util/request';
const conttype = 'application/json';
const qs = require('qs');

export class DemoServer {
  // 根据传入的opt对象，实例化一个axios实例
  constructor(opt, axiosFilterFn) {
    this.rSerivce = new RequestServerClass(opt, { headers: { 'Content-Type': conttype } });
    axiosFilterFn.call(this, this.rSerivce.serverObj)
  }

  loginIn(opts) {
    const url = '/user/login';
    return this.rSerivce.serverObj.post(url + '?' + qs.stringify(opts))
  }
  getData(opts) {
    const url = '/getUser';
    return this.rSerivce.serverObj.post(url, opts);
  }
}
