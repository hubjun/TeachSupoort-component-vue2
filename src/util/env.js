let jsonName = ''
if (process.env.VUE_APP_MODE === 'production') {
  jsonName = 'prod.config.json'
} else if (process.env.VUE_APP_MODE === 'test') {
  jsonName = 'test.config.json'
} else {
  jsonName = 'dev.config.json'
}

let baseIp = ''
let basePort = ''
let baseUrl = ''
let proxyName = ''

let ajax = new XMLHttpRequest()
if (window.ActiveXObject) { // code for IE6, IE5
                            // eslint-disable-next-line no-undef
  ajax = new ActiveXObject('Microsoft.XMLHTTP')
}
// 同步ajax
ajax.open('get', 'json/' + jsonName, false)
ajax.onreadystatechange = function () {
  if (ajax.readyState === 4 && ajax.status === 200) {
    if (typeof ajax.responseText === 'string') {
      let data = JSON.parse(ajax.responseText)
      // ip
      baseIp = data.baseIp
      // 端口号
      basePort = data.basePort
      // 接口服务路径
      baseUrl = 'http://' + baseIp + ':' + basePort
      // 代理地址
      proxyName = data.proxyName
    }
  }
}
ajax.send()

export {
  baseIp,
  basePort,
  baseUrl,
  proxyName
}
