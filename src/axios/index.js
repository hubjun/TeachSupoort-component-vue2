import axios from 'axios'
import store from '@/store/index';
import router from '@/router/index'
import { error, errorMsg } from '@/axios/common'
import { BASE_URL, urlName2 } from '@/axios/Global'
function GetRequest(url, key) {
  var theRequest = {};
  if (url.indexOf('?') !== -1) {
    var str = url.split('?')[1];
    var strs = str.split('&');
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
    }
  }
  if (theRequest[key] !== undefined) {
    return true;
  } else {
    return false;
  }
}

axios.interceptors.request.use(config => {
  const grantTypeFlag = GetRequest(config.url, 'grant_type');
  if (!grantTypeFlag) {
    const token = sessionStorage.getItem('TOKEN');
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, err => {
  return Promise.reject(err);
});

axios.interceptors.response.use(data => {
  if (data.headers.file) {
    sessionStorage.setItem('CADdownloadFileName', data.headers.file);
  }
  if(typeof data.data.status !== 'undefined') {
    if(data.data && !data.data.status) {
      errorMsg(data.data.code, data.data.msg)
    }
  }
  return data.data
}, error => {
  if (error.response) {
    console.log(error);
    // switch (error.response.status) {
    //   case 401:
    //     const token = sessionStorage.getItem('TOKEN');
    //     store.dispatch('Logout', token);
    //     router.push({ path: '/login' });
    //     break;
    //   default:
    //     return Promise.reject(error.response.data)
    // }
  }
  return Promise.reject(error.response.data)   // 返回接口返回的错误信息
})
axios.defaults.baseURL = BASE_URL;
export default axios
