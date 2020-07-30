const BaseFilter = {
  request(servObj) { // 请求拦截器
    servObj.interceptors.request.use(function(config) {
    return config;
  }, function(error) {
    return Promise.reject(error);
  });
},
response(servObj) { // 响应拦截器
  servObj.interceptors.response.use(function(res) {
    if(res.status === 200 && res.data) {
      return res.data;
    } else {
      return Promise.reject(new Error('未知服务器错误'));
    }
  })
}
}

function requireFilter(servObj) {
  BaseFilter.request(servObj);
  BaseFilter.response(servObj);
}

export default requireFilter;
