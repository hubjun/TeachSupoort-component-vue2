import axios from 'axios';

/* 注册axios的公共构造函数。可以导出一个axios对象  */
export class RequestServerClass {
  constructor(opt) {
    const obj = Object.assign({}, opt);
    this.serverObj = axios.create(
      obj
    )
  }
}
